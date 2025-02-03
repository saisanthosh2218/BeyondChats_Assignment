import { useState, useEffect } from "react";
import axios from "axios";

const SetupOrganisation = () => {
  const [company, setCompany] = useState({
    name: "",
    website: "",
    description: "",
  });
  const [submittedCompany, setSubmittedCompany] = useState(null);
  const [pages, setPages] = useState([]);
  const [selectedPageData, setSelectedPageData] = useState(null);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingComplete, setTrainingComplete] = useState(false);
  const [loading, setLoading] = useState(false); // Loader state

  const handleChange = (e) => {
    setCompany({ ...company, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loader
    try {
      const response = await axios.post(
        "https://beyondchats-assignment-759z.onrender.com/api/company/register",
        company
      );
      setSubmittedCompany(response.data.company);
      fetchPageData(response.data.company._id);
    } catch (error) {
      console.error("Error registering company:", error);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  const fetchPageData = async (companyId) => {
    try {
      const response = await axios.get(
        `https://beyondchats-assignment-759z.onrender.com/api/company/${companyId}/pages`
      );
      setPages(response.data);
    } catch (error) {
      console.error("Error fetching pages:", error);
    }
  };

  useEffect(() => {
    if (!submittedCompany) return;

    let interval = setInterval(async () => {
      try {
        const response = await axios.get(
          `https://beyondchats-assignment-759z.onrender.com/api/company/${submittedCompany._id}/training-status`
        );
        setTrainingProgress(response.data.progress);
        if (response.data.progress >= 100) {
          clearInterval(interval);
          setTrainingComplete(true);
        }
      } catch (error) {
        console.error("Error fetching training progress:", error);
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [submittedCompany]);

  return (
    <div className="container">
      <h2 className="text-center uppercase font-bold mt-4 mb-2 text-3xl">
        Setup Organisation
      </h2>

      {/* Show Loader if Data is Fetching */}
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="border-t-4 border-blue-500 border-solid rounded-full w-12 h-12 animate-spin"></div>
        </div>
      ) : (
        <>
          {!submittedCompany ? (
            <div className="mx-auto h-full w-sm md:w-xl bg-white rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-2 border border-gray-200 p-4">
              <form
                className="flex flex-col justify-center"
                onSubmit={handleSubmit}
              >
                <label htmlFor="name">Company Name</label>
                <input
                  className="border-b p-1 outline-none"
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter Company Name"
                  onChange={handleChange}
                  required
                />
                <label htmlFor="website">Company Website</label>
                <input
                  className="border-b p-1 outline-none"
                  id="website"
                  type="text"
                  name="website"
                  placeholder="Enter Company Website URL"
                  onChange={handleChange}
                  required
                />
                <label htmlFor="desc">
                  Company Description{" "}
                  <span className="text-sm text-gray-400">(optional)</span>
                </label>
                <textarea
                  className="border-b p-1 outline-none"
                  id="desc"
                  name="description"
                  placeholder="Enter Company Description"
                  onChange={handleChange}
                ></textarea>
                <button
                  className="bg-blue-500 hover:cursor-pointer hover:bg-blue-500 mt-2 text-white font-bold py-2 px-4 rounded"
                  type="submit"
                >
                  Register
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-black text-white border rounded-md border-gray-300 p-4 w-sm md:w-xl mx-auto mt-2">
              <h3 className="capitalize">
                Company Registered: {submittedCompany.name}
              </h3>
              <p>Website Name: {submittedCompany.website}</p>
              <p>
                Description:{" "}
                <span className="capitalize font-serif">
                  {submittedCompany.description}
                </span>
              </p>
              <div className="flex flex-col items-center mb-2 mt-2">
                <h4 className="underline text-lg text-center">
                  Detected Webpages
                </h4>
                <ul className="text-center">
                  {pages.map((page, index) => (
                    <li
                      className="cursor-pointer"
                      key={index}
                      onClick={() => setSelectedPageData(page.scrapedData)}
                    >
                      {page.url} -{" "}
                      <span className="uppercase">{page.status}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className="bg-red-600 font-semibold cursor-pointer uppercase mt-2 p-1 rounded-md text-center"
                  onClick={() => fetchPageData(submittedCompany._id)}
                >
                  Refresh Pages
                </button>
              </div>

              {selectedPageData && (
                <div>
                  <h5 className="underline text-lg text-center">
                    Scraped Data
                  </h5>
                  <p className="text-center">
                    {selectedPageData.length
                      ? selectedPageData.join(", ")
                      : "No data available"}
                  </p>
                </div>
              )}

              {/* Chatbot Training Progress */}
              <h3 className="text-center mt-2 font-semibold">
                Chatbot Training
              </h3>
              {!trainingComplete ? (
                <div className="mx-auto text-center">
                  <p className="text-center">
                    Training in progress... {trainingProgress}%
                  </p>
                  <div className="h-2 w-full bg-gray-300">
                    <div
                      style={{ width: `${trainingProgress}%` }}
                      className={"h-full bg-green-600"}
                    ></div>
                  </div>{" "}
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <p className="text-center text-lg font-bold">
                    Training Complete!
                  </p>
                  <button
                    className="bg-green-600 cursor-pointer p-1 rounded-sm mt-2 text-white uppercase font-semibold"
                    onClick={() => alert("Moving to Next Step!")}
                  >
                    Continue Setup
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SetupOrganisation;
