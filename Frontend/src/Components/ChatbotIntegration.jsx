import { useState } from "react";
import Confetti from "react-confetti";

const ChatbotIntegration = () => {
  const [integrationStatus, setIntegrationStatus] = useState(null);
  const [testingIntegration, setTestingIntegration] = useState(false);
  const [hasTested, setHasTested] = useState(false); // Track if test button is clicked

  const clientWebsite = "https://sai-santhosh-portfolio.netlify.app/";

  const testIntegration = async () => {
    setTestingIntegration(true);
    setHasTested(true); // Mark that the test button has been clicked

    // ✅ Add chatbot script dynamically
    if (
      !document.querySelector(
        'script[src="https://amazing-salamander-b53819.netlify.app/chatbot.js"]'
      )
    ) {
      const script = document.createElement("script");
      script.src = "https://amazing-salamander-b53819.netlify.app/chatbot.js";
      script.defer = true;
      document.body.appendChild(script);
    }

    // ✅ Wait for the script to load and verify
    setTimeout(() => {
      const scriptExists = document.querySelector(
        'script[src="https://amazing-salamander-b53819.netlify.app/chatbot.js"]'
      );
      setIntegrationStatus(scriptExists ? "success" : "failed");
      setTestingIntegration(false);
    }, 2000); // Wait 2 seconds before checking
  };

  const shareOnLinkedIn = () => {
    const linkedInURL = `https://www.linkedin.com/sharing/share-offsite/?url=${clientWebsite}`;
    window.open(linkedInURL, "_blank");
  };

  const shareOnTwitter = () => {
    const tweetText = `🚀 Just integrated a chatbot on my website! Check it out: ${clientWebsite}`;
    const twitterURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetText
    )}`;
    window.open(twitterURL, "_blank");
  };

  return (
    <div className="container text-center p-4">
      <h2 className="text-xl font-bold mb-4">Chatbot Integration & Testing</h2>

      {/* ✅ Show only test button initially */}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
        onClick={testIntegration}
        disabled={testingIntegration}
      >
        {testingIntegration ? "Testing..." : "Test Integration"}
      </button>

      {/* ✅ Show results only after clicking "Test Integration" */}
      {hasTested && (
        <div className="mt-4">
          {integrationStatus === "success" ? (
            <div className="success-container w-80 p-2 md:w-md flex flex-col justify-center mx-auto md:p-4 bg-green-100 border border-green-400 rounded">
              <Confetti />
              <h3 className="text-green-700 text-xl font-semibold">
                <h1>Yoooohoooooo!!!!</h1>
                🎉 Integration Successful! 🎉
              </h3>

              {/* ✅ Admin Panel Button */}
              <button
                className="bg-gray-800 text-white px-3 py-1 rounded mt-2 hover:bg-gray-900"
                onClick={() => alert("Opening Admin Panel")}
              >
                Explore Admin Panel
              </button>

              {/* ✅ Start Chatbot Button */}
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded mt-2 hover:bg-blue-700"
                onClick={() => alert("Starting Chatbot...")}
              >
                Start Talking to Chatbot
              </button>

              {/* ✅ Social Media Sharing */}
              <p className="mt-2 font-semibold">Share your success:</p>
              <button
                className="bg-blue-500 w-full text-white px-3 py-1 rounded mr-2 mt-2 hover:bg-blue-600"
                onClick={shareOnLinkedIn}
              >
                Share on LinkedIn
              </button>
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded mt-2 hover:bg-blue-500"
                onClick={shareOnTwitter}
              >
                Share on Twitter
              </button>
            </div>
          ) : integrationStatus === "failed" ? (
            <div className="error-container p-4 bg-red-100 border border-red-400 rounded">
              <h3 className="text-red-700 text-xl font-semibold">
                Integration not detected!
              </h3>
              <p>Please try again or check if the script is properly added.</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default ChatbotIntegration;
