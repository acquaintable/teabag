require "spec_helper"
require "teabag/formatters/dot_formatter"
require "teabag/result"

describe Teabag::Formatters::DotFormatter do

  before do
    @log = ""
    STDOUT.stub(:print) { |s| @log << s }
  end

  describe "#spec" do

    it "tracks totals" do
      subject.total = 41
      subject.should_receive(:log).with(".", 32)
      subject.spec(Teabag::Result.build_from_json("status" => "passed"))
      expect(subject.total).to be(42)
    end

    it "logs a green . on pass" do
      subject.should_receive(:log).with(".", 32)
      subject.spec(Teabag::Result.build_from_json("status" => "passed"))
    end

    it "logs a yellow * on pending" do
      subject.should_receive(:log).with("*", 33)
      subject.spec(Teabag::Result.build_from_json("status" => "pending"))
    end

    it "logs a red F on anything else" do
      subject.should_receive(:log).with("F", 31)
      subject.spec(Teabag::Result.build_from_json("status" => "foo"))
    end

  end

  describe "#error" do

    it "logs the error" do
      trace = {"file" => "http://127.0.0.1:31337/assets/path/file.js?foo=true&body=1", "line" => 42, "function" => "notAnAnonFunc"}
      subject.error("message" => "_message_", "trace" => [trace])
      expect(@log).to eq("\e[31m_message_\n\e[0m\e[36m  # path/file.js?foo=true:42 -- notAnAnonFunc\n\e[0m\n")
    end

  end

  describe "#result" do

    before do
      subject.total = 666
    end

    describe "with no failures" do

      it "logs the details" do
        subject.result("elapsed" => 0.31337)
        expect(@log).to eq("\n\nFinished in 0.31337 seconds\n\e[32m666 examples, 0 failures\n\e[0m")
      end

    end

    describe "with failures" do

      it "logs the details and raises an exception" do
        subject.failures << Teabag::Result.build_from_json("label" => "some spec", "suite" => "full description", "message" => "some message", "link" => "?grep=some%20spec")
        expect {
          subject.result("elapsed" => 0.31337)
        }.to raise_error(Teabag::Failure)
        expect(@log).to eq("\n\nFailures:\n\n  1) full description some spec\n\e[31m     Failure/Error: some message\n\e[0m\nFinished in 0.31337 seconds\n\e[31m666 examples, 1 failure\n\e[0m\nFailed examples:\n\e[31m\n/teabag/default?grep=some%20spec\e[0m\n\n")
        expect(subject.failures.length).to be(1)
      end

      describe "when fail_fast is false" do

        after do
          Teabag.configuration.fail_fast = true
        end

        it "doesn't raise the exception" do
          Teabag.configuration.fail_fast = false
          subject.failures << Teabag::Result.build_from_json("message" => "some message")
          subject.result("elapsed" => 0.31337)
          expect(subject.failures.length).to be(1)
        end

      end

    end

    describe "with pending" do

      it "logs the details" do
        subject.pendings << Teabag::Result.build_from_json("label" => "some spec", "suite" => "full description")
        subject.result("elapsed" => 0.31337)
        expect(@log).to eq("\n\nPending:\e[33m\n  full description some spec\n\e[0m\e[36m    # Not yet implemented\n\e[0m\nFinished in 0.31337 seconds\n\e[33m666 examples, 0 failures, 1 pending\n\e[0m")
      end

    end

  end

  describe "#exception" do

    it "raises" do
      expect { subject.exception }.to raise_error(Teabag::RunnerException)
    end

  end

  describe "#log" do

    it "calls STDOUT.write" do
      STDOUT.should_receive(:print).with("foo")
      subject.send(:log, "foo")
    end

    it "colorizes" do
      STDOUT.should_receive(:print).with("\e[31mfoo\e[0m")
      subject.send(:log, "foo", 31)
    end
  end

end
