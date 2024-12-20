import plannerLogo from "../../assets/logo.png";
import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../ui/select";
import { Upload } from "lucide-react";
import { requestPlan } from "@/api/requestPlan";
import { generateAndDownloadPDF } from "@/api/generatePdf";

const LessonPlanner = () => {
  const [grade, setGrade] = useState<string>("");
  const [minutes, setMinutes] = useState<string>("");
  const [planDescription, setPlanDescription] = useState<string>("");
  const [generatedPlan, setGeneratedPlan] = useState<string>("");
  const [copyPlanVisible, setCopyPlanVisible] = useState(false);
  const [loadingPlanRequest, setLoadingPlanRequest] = useState(false);

  const handleGradeChange = (value: string) => setGrade(value);
  const handleMinutesChange = (value: string) => setMinutes(value);
  const handlePlanDescriptionChange = (value: string) =>
    setPlanDescription(value);
  const handlePlanChange = (value: string) => setGeneratedPlan(value);

  const handlePlanRequest = async () => {
    setLoadingPlanRequest(true);
    const plan = await requestPlan(planDescription, minutes);
    setLoadingPlanRequest(false);
    setGeneratedPlan(plan);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPlan).then(() => {
      setCopyPlanVisible(true);

      setTimeout(() => {
        setCopyPlanVisible(false);
      }, 2000);
    });
  };

  const handlePDFDownload = async () => {
    const PDF = await generateAndDownloadPDF(generatedPlan);

    if (PDF) {
      const url = URL.createObjectURL(PDF);

      const link = document.createElement("a");

      link.href = url;
      link.download = "generated-lesson-plan.pdf";

      link.click();

      URL.revokeObjectURL(url);
    } else {
      console.error("Failed to generate the PDF");
    }
  };

  return (
    <div className="p-5 flex items-center bg-gray-100 max-w-xl w-full">
      <div className="px-1 py-2 bg-white rounded-xl border border-gray-200 w-full">
        <img src={plannerLogo} alt="logo" />
        <div className="p-2">
          <p className="text-lg font-medium">Lesson Planner</p>
          <p className="text-sm text-gray-500">
            This AI tool helps you with creating lesson plans for your class!
          </p>

          <div className="mt-5">
            <p className="mb-1 text-sm font-medium">Grade level:</p>
            <Select value={grade} onValueChange={handleGradeChange}>
              <SelectTrigger className="p-6 rounded-[50px] outline-none border border-gray-300 focus:ring-2 focus:ring-gray-700">
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1st grade">1st grade</SelectItem>
                <SelectItem value="2nd grade">2nd grade</SelectItem>
                <SelectItem value="3rd grade">3rd grade</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-5">
            <p className="mb-1 text-sm font-medium">
              Lecture duration (in minutes)
            </p>
            <Select value={minutes} onValueChange={handleMinutesChange}>
              <SelectTrigger className="p-6 rounded-[50px] outline-none border border-gray-300 focus:ring-2 focus:ring-gray-700">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="45">45</SelectItem>
                <SelectItem value="60">60</SelectItem>
                <SelectItem value="90">90</SelectItem>
                <SelectItem value="120">120</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <p className="mt-4 mb-1 text-sm font-medium">
            Topic, Standard, or Objective
          </p>
          <p className="text-gray-500 text-[12px]">
            Provide how the assignment should open the conversation
          </p>
          <textarea
            rows={6}
            value={planDescription}
            onChange={(e) => handlePlanDescriptionChange(e.target.value)}
            placeholder="Example: student last lesson was on the geography of the United States, have the lesson include group work, etc. The lesson should include standards (CSS, TEKS)"
            className="mt-1 px-5 py-2 w-full text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 resize-none placeholder:text-xs"
          />

          <p className="my-1 text-xs font-light">Upload additional documents</p>
          <div className="py-6 flex justify-center items-center w-full rounded-lg border border-gray-300 border-dashed">
            <div className="flex flex-col items-center">
              <button className="px-4 py-3 flex gap-2 items-center rounded-lg bg-[#202020] text-white text-xs font-light">
                <Upload strokeWidth={2.25} size={16} />
                <p>Upload a file</p>
              </button>
              <p className="mt-2 text-[10px] text-gray-500">
                Max. file size 50 MB
              </p>
              <p className="text-[10px] text-gray-500">
                (PDF, DOCX, PPTX, TXT, HTML)
              </p>
            </div>
          </div>

          <button
            disabled={!minutes || !planDescription}
            onClick={handlePlanRequest}
            className={`mt-6 p-4 w-full gap-2 items-center rounded-3xl ${
              !minutes || !planDescription ? "bg-gray-300" : "bg-[#202020]"
            } text-white text-xs font-light`}
          >
            Create lesson plan
          </button>
          <button className="mt-1 p-4 w-full gap-2 items-center rounded-3xl bg-white hover:bg-gray-200 text-red-500 font-normal text-xs">
            Cancel
          </button>

          {loadingPlanRequest && (
            <p className="text-sm text-gray-500">Loading your lesson plan...</p>
          )}

          <hr className="mt-4 mb-6" />

          <p className="w-full text-center font-medium">
            Generated lesson plan
          </p>
          <textarea
            placeholder="Your generated lesson plan will appear here..."
            value={generatedPlan}
            onChange={(e) => handlePlanChange(e.target.value)}
            rows={6}
            className="mt-1 px-5 py-2 w-full text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 resize-none"
          />
          <div className="flex justify-between flex-wrap gap-y-1 relative">
            <button
              disabled={generatedPlan.length < 1}
              onClick={handleCopy}
              className={`px-4 py-2 rounded-lg ${
                generatedPlan.length < 1 ? "bg-gray-300" : "bg-[#202020]"
              }  text-white text-xs font-light`}
            >
              Copy
            </button>
            {copyPlanVisible && (
              <div className="mt-2 text-center text-sm text-green-500 absolute left-20">
                Text copied to clipboard!
              </div>
            )}
            <button
              disabled={generatedPlan.length < 1}
              onClick={handlePDFDownload}
              className={`px-4 py-2 rounded-lg ${
                generatedPlan.length < 1 ? "bg-gray-300" : "bg-[#202020]"
              }  text-white text-xs font-light`}
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPlanner;
