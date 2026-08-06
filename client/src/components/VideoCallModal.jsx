// components/VideoCallModal.jsx
import { FaTimes } from "react-icons/fa";

export default function VideoCallModal({ meetingLink, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Video Consultation</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <FaTimes />
          </button>
        </div>
        <div className="h-[70vh]">
          <iframe
            src={meetingLink}
            className="w-full h-full border-0"
            allow="camera; microphone; fullscreen; display-capture"
            title="Video Consultation"
          />
        </div>
      </div>
    </div>
  );
}