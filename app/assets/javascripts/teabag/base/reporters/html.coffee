#= require teabag/base/reporters/html/base_view
#= require_self
#= require teabag/base/reporters/html/progress_view
#= require teabag/base/reporters/html/spec_view
#= require teabag/base/reporters/html/failure_view
#= require teabag/base/reporters/html/suite_view

class Teabag.Reporters.HTML extends Teabag.Reporters.BaseView

  constructor: ->
    @start = new Teabag.Date().getTime()
    @config = {"use-catch": true, "build-full-report": false, "display-progress": true}
    @total = {exist: 0, run: 0, passes: 0, failures: 0, skipped: 0}
    @views = {specs: {}, suites: {}}
    @filter = false
    @readConfig()
    super


  build: ->
    @buildLayout()
    @el = @findEl("report-all")
    @setText("env-info", @envInfo())
    @setText("version", Teabag.version)
    @findEl("toggles").onclick = @toggleConfig
    @findEl("suite-select")?.onchange = @changeSuite
    @showConfiguration()
    @buildProgress()


  buildLayout: ->
    el = @createEl("div")
    document.body.appendChild(el)
    el.innerHTML = """
      <div id="teabag-html-reporter">
        <div class="teabag-clearfix">
          <div id="teabag-title">
            <h1>Teabag</h1>
            <ul>
              <li>version: <b id="teabag-version"></b></li>
              <li id="teabag-env-info"></li>
            </ul>
          </div>
          <div id="teabag-progress"></div>
          <ul id="teabag-stats">
            <li>passes: <b id="teabag-stats-passes">0</b></li>
            <li>failures: <b id="teabag-stats-failures">0</b></li>
            <li>skipped: <b id="teabag-stats-skipped">0</b></li>
            <li>duration: <b id="teabag-stats-duration">&infin;</b></li>
          </ul>
        </div>

        <div id="teabag-controls" class="teabag-clearfix">
          <div id="teabag-toggles">
            <button id="teabag-use-catch" title="Toggle using try/catch wrappers when possible">Try/Catch</button>
            <button id="teabag-build-full-report" title="Toggle building the full report">Full Report</button>
            <button id="teabag-display-progress" title="Toggle displaying progress as tests run">Progress</button>
          </div>
          <div id="teabag-filter">
            #{@buildSuiteSelect()}
            <button onclick="window.location.href = window.location.pathname">Run All</button>
            <span id="teabag-filter-info">
          </div>
        </div>

        <hr/>

        <div id="teabag-report">
          <ol id="teabag-report-failures"></ol>
          <ol id="teabag-report-all"></ol>
        </div>
      </div>
    """


  buildSuiteSelect: ->
    return "" if Teabag.suites.all.length == 1
    options = []
    for suite in Teabag.suites.all
      options.push("""<option#{if Teabag.suites.active == suite then " selected='selected'" else ""} value="#{suite}">#{suite} suite</option>""")
    """<select id="teabag-suite-select">#{options.join("")}</select>"""


  buildProgress: ->
    @progress = Teabag.Reporters.HTML.ProgressView.create(@config["display-progress"])
    @progress.appendTo(@findEl("progress"))


  reportRunnerStarting: (runner) ->
    @total.exist = runner.total || runner.specs().length
    @setText("stats-duration", "...") if @total.exist


  reportSpecStarting: (spec) ->
    spec = new Teabag.Spec(spec)
    @reportView = new Teabag.Reporters.HTML.SpecView(spec, @) if @config["build-full-report"]
    @specStart = new Teabag.Date().getTime()


  reportSpecResults: (spec) ->
    @total.run += 1
    @updateProgress()
    @updateStatus(spec)


  reportRunnerResults: =>
    return unless @total.run
    @setText("stats-duration", @elapsedTime())
    @setStatus("passed") unless @total.failures
    @setText("stats-passes", @total.passes)
    @setText("stats-failures", @total.failures)
    if @total.run < @total.exist
      @total.skipped = @total.exist - @total.run
      @total.run = @total.exist
    @setText("stats-skipped", @total.skipped)
    @updateProgress()


  elapsedTime: ->
    "#{((new Teabag.Date().getTime() - @start) / 1000).toFixed(3)}s"


  updateStat: (name, value) ->
    return unless @config["display-progress"]
    @setText("stats-#{name}", value)


  updateStatus: (spec) ->
    spec = new Teabag.Spec(spec)
    result = spec.result()

    if result.skipped || result.status == "pending"
      @updateStat("skipped", @total.skipped += 1)
      return

    elapsed = new Teabag.Date().getTime() - @specStart

    if result.status == "passed"
      @updateStat("passes", @total.passes += 1)
      @reportView?.updateState("passed", elapsed)
    else
      @updateStat("failures", @total.failures += 1)
      @reportView?.updateState("failed", elapsed)
      new Teabag.Reporters.HTML.FailureView(spec).appendTo(@findEl("report-failures")) unless @config["build-full-report"]
      @setStatus("failed")


  updateProgress: ->
    @progress.update(@total.exist, @total.run)


  showConfiguration: ->
    @setClass(key, if value then "active" else "") for key, value of @config


  setStatus: (status) ->
    document.body.className = "teabag-#{status}"


  setFilter: (filter) ->
    return unless filter
    @setClass("filter", "teabag-filtered")
    @setHtml("filter-info", "#{filter}", true)


  readConfig: ->
    @config = config if config = @cookie("teabag")


  toggleConfig: (e) =>
    button = e.target
    return unless button.tagName.toLowerCase() == "button"
    name = button.getAttribute("id").replace(/^teabag-/, "")
    @config[name] = !@config[name]
    @cookie("teabag", @config)
    @refresh()


  changeSuite: ->
    window.location.href = "/teabag/#{@options[@options.selectedIndex].value}"


  refresh: ->
    window.location.href = window.location.href


  cookie: (name, value = undefined) ->
    if value == undefined
      name = name.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1")
      match = document.cookie.match(new RegExp("(?:^|;)\\s?#{name}=(.*?)(?:;|$)", "i"))
      match && JSON.parse(unescape(match[1]).split(" ")[0])
    else
      date = new Teabag.Date()
      date.setDate(date.getDate() + 365)
      document.cookie = "#{name}=#{escape(JSON.stringify(value))}; path=\"/\"; expires=#{date.toUTCString()};"
