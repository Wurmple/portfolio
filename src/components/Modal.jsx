export default function Modal({ isOpen, onClose, content }) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <h2 className="text-2xl font-bold text-blue-700">{content.title}</h2>
          {content.company && <p className="text-gray-700">{content.company}</p>}
          <p className="text-gray-500">{content.date}</p>
          <ul className="list-disc pl-5 mt-2 text-gray-700">
            {content.description?.map((item, index) => (
              <li key={index} className="mb-2">{item}</li>
            ))}
          </ul>
          <button
            onClick={onClose}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    );
  }