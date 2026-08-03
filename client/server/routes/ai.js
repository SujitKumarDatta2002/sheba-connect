// const express = require("express");
// const axios = require("axios");

// const router = express.Router();

// // HuggingFace APIs
// const HF_TEXT_GEN_API = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1";
// const HF_TRANSLATION_API = "https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-en-bn";

// // ============================
// // Generate Complaint (AI)
// // ============================
// router.post("/generate-complaint", async (req, res) => {
//   const { department, keyword, description, citizenName, citizenId, address, contactNumber, language } = req.body;

//   console.log("Received AI request:", { department, keyword, description, citizenName, language });

//   if (!keyword) {
//     return res.status(400).json({ success: false, message: "Missing required fields" });
//   }

//   try {
//     let englishText = "";
//     let banglaText = "";

//     // Create prompts based on language
//     if (language === "bn") {
//       // Bengali prompt for generating complaint in Bengali
//       const bengaliPrompt = `আপনি বাংলাদেশ সরকারের একজন আনুষ্ঠানিক অভিযোগ লেখক। নিচের তথ্যের ভিত্তিতে একটি পেশাদার অভিযোগ পত্র লিখুন:

// বিভাগ: ${department || "সরকারি বিভাগ"}
// ইস্যু: ${keyword}
// বিবরণ: ${description || "অনুগ্রহ করে বিবরণ দিন"}
// অভিযোগকারীর নাম: ${citizenName || "নাগরিক"}
// এনআইডি: ${citizenId || "N/A"}
// ঠিকানা: ${address || "N/A"}
// যোগাযোগ: ${contactNumber || "N/A"}

// একটি পেশাদার অভিযোগ পত্র লিখুন যাতে থাকবে:
// 1. সঠিক ঠিকানা
// 2. স্পষ্ট বিষয়বস্তু
// 3. অভিযোগকারীর পরিচয়
// 4. সমস্যার বিস্তারিত বিবরণ
// 5. সমাধানের জন্য নির্দিষ্ট অনুরোধ
// 6. পেশাদার সমাপ্তি

// বাংলা ভাষায় লিখুন। পেশাদার ও আনুষ্ঠানিক শৈলী বজায় রাখুন।`;

//       try {
//         const bnResponse = await axios.post(
//           HF_TEXT_GEN_API,
//           {
//             inputs: bengaliPrompt,
//             parameters: {
//               max_length: 800,
//               temperature: 0.7,
//               do_sample: true,
//               top_p: 0.95
//             }
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
//               "Content-Type": "application/json"
//             },
//             timeout: 45000
//           }
//         );

//         banglaText = bnResponse.data?.[0]?.generated_text || "";
        
//         // Clean up the response
//         if (banglaText.includes(bengaliPrompt)) {
//           banglaText = banglaText.replace(bengaliPrompt, "").trim();
//         }
        
//         // If Bengali generation failed, create a fallback
//         if (!banglaText || banglaText.length < 50) {
//           banglaText = `আমি, ${citizenName || "নাগরিক"}, ${address || "নিজ ঠিকানা"} এর বাসিন্দা, আপনার সদয় দৃষ্টি আকর্ষণ করে জানাচ্ছি যে ${keyword} সংক্রান্ত একটি জরুরি বিষয়ে আপনার হস্তক্ষেপ কামনা করছি।

// বিস্তারিত বিবরণ: ${description || "বিস্তারিত বিবরণ প্রদান করুন"}

// অতএব, আমি আপনার কাছে বিনীত অনুরোধ করছি বিষয়টি দ্রুত তদন্ত করে প্রয়োজনীয় ব্যবস্থা গ্রহণ করার জন্য।

// ধন্যবাদান্তে,
// ${citizenName || "নাগরিক"}
// যোগাযোগ: ${contactNumber || "N/A"}`;
//         }
//       } catch (genError) {
//         console.error("Bengali generation error:", genError.message);
//         // Fallback Bengali text
//         banglaText = `আমি, ${citizenName || "নাগরিক"}, ${address || "নিজ ঠিকানা"} এর বাসিন্দা, আপনার সদয় দৃষ্টি আকর্ষণ করে জানাচ্ছি যে ${keyword} সংক্রান্ত একটি জরুরি বিষয়ে আপনার হস্তক্ষেপ কামনা করছি।

// ${description || "বিস্তারিত বিবরণ প্রদান করুন"}

// অতএব, আমি আপনার কাছে বিনীত অনুরোধ করছি বিষয়টি দ্রুত তদন্ত করে প্রয়োজনীয় ব্যবস্থা গ্রহণ করার জন্য।

// ধন্যবাদান্তে,
// ${citizenName || "নাগরিক"}
// যোগাযোগ: ${contactNumber || "N/A"}`;
//       }
      
//       // Translate Bengali to English for storage
//       try {
//         const enResponse = await axios.post(
//           HF_TRANSLATION_API,
//           { inputs: banglaText },
//           {
//             headers: {
//               Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
//               "Content-Type": "application/json"
//             },
//             timeout: 30000
//           }
//         );
//         englishText = enResponse.data?.[0]?.translation_text || banglaText;
//       } catch (transError) {
//         console.error("Translation to English error:", transError.message);
//         englishText = banglaText;
//       }
      
//     } else {
//       // English prompt for generating complaint in English
//       const englishPrompt = `You are a formal complaint writer for the Government of Bangladesh. Write a professional, context-aware complaint letter based on the following information:

// Department: ${department || "Government Department"}
// Issue Keyword: ${keyword}
// Description: ${description || "Please describe the issue"}
// Complainant Name: ${citizenName || "Citizen"}
// NID: ${citizenId || "N/A"}
// Address: ${address || "N/A"}
// Contact: ${contactNumber || "N/A"}

// Write a detailed, context-aware formal complaint letter with:
// 1. Proper addressing to the department head
// 2. Clear subject line mentioning the specific issue
// 3. Introduction of the complainant with details
// 4. Detailed, context-aware description of the problem (expand on the user's input)
// 5. Specific, actionable requests for resolution
// 6. Declaration of truth
// 7. Professional closing

// Make it sound official, urgent where appropriate, and context-aware. Use the specific keywords and details provided. Keep it concise but comprehensive (250-400 words).`;

//       try {
//         const enResponse = await axios.post(
//           HF_TEXT_GEN_API,
//           {
//             inputs: englishPrompt,
//             parameters: {
//               max_length: 800,
//               temperature: 0.7,
//               do_sample: true,
//               top_p: 0.95
//             }
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
//               "Content-Type": "application/json"
//             },
//             timeout: 45000
//           }
//         );

//         englishText = enResponse.data?.[0]?.generated_text || "";
        
//         // Clean up the response
//         if (englishText.includes(englishPrompt)) {
//           englishText = englishText.replace(englishPrompt, "").trim();
//         }
        
//         // If generation failed, create a fallback
//         if (!englishText || englishText.length < 50) {
//           englishText = `I am writing to formally complain about ${keyword}. ${description}

// I, ${citizenName || "Citizen"}, residing at ${address || "N/A"}, bearing NID No. ${citizenId || "N/A"}, would like to bring the following matter to your urgent attention.

// Details of the issue: ${description || "Please provide details"}

// This issue has been causing significant hardship. I request you to investigate the matter urgently and take appropriate action.

// Thank you for your understanding.

// Yours faithfully,
// ${citizenName || "Citizen"}
// Contact: ${contactNumber || "N/A"}`;
//         }
//       } catch (genError) {
//         console.error("English generation error:", genError.message);
//         // Fallback English text
//         englishText = `I am writing to formally complain about ${keyword}. ${description}

// I, ${citizenName || "Citizen"}, residing at ${address || "N/A"}, bearing NID No. ${citizenId || "N/A"}, request your urgent attention to this matter.

// Please investigate and take necessary action at the earliest convenience.

// Yours faithfully,
// ${citizenName || "Citizen"}
// Contact: ${contactNumber || "N/A"}`;
//       }
      
//       // Translate English to Bengali
//       try {
//         const bnResponse = await axios.post(
//           HF_TRANSLATION_API,
//           { inputs: englishText },
//           {
//             headers: {
//               Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
//               "Content-Type": "application/json"
//             },
//             timeout: 30000
//           }
//         );
//         banglaText = bnResponse.data?.[0]?.translation_text || englishText;
//       } catch (transError) {
//         console.error("Translation to Bengali error:", transError.message);
//         banglaText = englishText;
//       }
//     }

//     res.json({
//       success: true,
//       english: englishText,
//       bangla: banglaText
//     });

//   } catch (err) {
//     console.error("AI generation error:", err.message);
//     res.status(500).json({ 
//       success: false, 
//       message: "AI generation failed. Please try again later.",
//       error: err.message 
//     });
//   }
// });

// // ============================
// // Translate API
// // ============================
// router.post("/translate", async (req, res) => {
//   const { text, targetLang } = req.body;

//   if (!text) {
//     return res.status(400).json({ success: false, message: "Missing text to translate" });
//   }

//   if (targetLang !== "bn") {
//     return res.json({ success: true, translated: text });
//   }

//   try {
//     const response = await axios.post(
//       HF_TRANSLATION_API,
//       { inputs: text },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
//           "Content-Type": "application/json"
//         },
//         timeout: 30000
//       }
//     );

//     const translated = response.data?.[0]?.translation_text || text;
//     res.json({ success: true, translated });
//   } catch (err) {
//     console.error("Translation error:", err.message);
//     res.json({ success: false, translated: text, error: err.message });
//   }
// });

// // ============================
// // Health check endpoint
// // ============================
// router.get("/health", (req, res) => {
//   res.json({ status: "AI service is running", apiKeySet: !!process.env.HF_API_TOKEN });
// });

// module.exports = router;


const express = require("express");
const axios = require("axios");

const router = express.Router();

// HuggingFace APIs
const HF_TEXT_GEN_API = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1";
const HF_TRANSLATION_API = "https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-en-bn";

// Helper function to translate text
const translateText = async (text, targetLang) => {
  if (targetLang !== "bn" || !text || text.trim() === "") return text;
  
  try {
    const response = await axios.post(
      HF_TRANSLATION_API,
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
          "Content-Type": "application/json"
        },
        timeout: 30000
      }
    );
    return response.data?.[0]?.translation_text || text;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
};

// ============================
// Generate Complaint (AI)
// ============================
router.post("/generate-complaint", async (req, res) => {
  const { department, keyword, description, citizenName, citizenId, address, contactNumber, language } = req.body;

  console.log("Received AI request:", { department, keyword, description, citizenName, language });

  if (!keyword) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    let englishText = "";
    let banglaText = "";
    
    // Translate user name to Bengali if needed
    let translatedName = citizenName;
    let translatedAddress = address;
    
    if (language === "bn") {
      translatedName = await translateText(citizenName, "bn");
      translatedAddress = await translateText(address, "bn");
    }

    if (language === "bn") {
      // Bengali prompt with translated name
      const bengaliPrompt = `আপনি বাংলাদেশ সরকারের একজন আনুষ্ঠানিক অভিযোগ লেখক। নিচের তথ্যের ভিত্তিতে একটি পেশাদার অভিযোগ পত্র লিখুন:

বিভাগ: ${department || "সরকারি বিভাগ"}
ইস্যু: ${keyword}
বিবরণ: ${description || "অনুগ্রহ করে বিবরণ দিন"}
অভিযোগকারীর নাম: ${translatedName || citizenName || "নাগরিক"}
এনআইডি: ${citizenId || "N/A"}
ঠিকানা: ${translatedAddress || address || "N/A"}
যোগাযোগ: ${contactNumber || "N/A"}

একটি পেশাদার অভিযোগ পত্র লিখুন যাতে থাকবে:
1. সঠিক ঠিকানা
2. স্পষ্ট বিষয়বস্তু
3. অভিযোগকারীর পরিচয় (নাম: ${translatedName || citizenName})
4. সমস্যার বিস্তারিত বিবরণ
5. সমাধানের জন্য নির্দিষ্ট অনুরোধ
6. পেশাদার সমাপ্তি

বাংলা ভাষায় লিখুন। পেশাদার ও আনুষ্ঠানিক শৈলী বজায় রাখুন। অভিযোগকারীর নাম "${translatedName || citizenName}" ব্যবহার করুন।`;

      try {
        const bnResponse = await axios.post(
          HF_TEXT_GEN_API,
          {
            inputs: bengaliPrompt,
            parameters: {
              max_length: 800,
              temperature: 0.7,
              do_sample: true,
              top_p: 0.95
            }
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
              "Content-Type": "application/json"
            },
            timeout: 45000
          }
        );

        banglaText = bnResponse.data?.[0]?.generated_text || "";
        
        // Clean up the response
        if (banglaText.includes(bengaliPrompt)) {
          banglaText = banglaText.replace(bengaliPrompt, "").trim();
        }
        
        // If Bengali generation failed, create a fallback with translated name
        if (!banglaText || banglaText.length < 50) {
          banglaText = `আমি, ${translatedName || citizenName || "নাগরিক"}, ${translatedAddress || address || "নিজ ঠিকানা"} এর বাসিন্দা, আপনার সদয় দৃষ্টি আকর্ষণ করে জানাচ্ছি যে "${keyword}" সংক্রান্ত একটি জরুরি বিষয়ে আপনার হস্তক্ষেপ কামনা করছি।

বিস্তারিত বিবরণ: ${description || "বিস্তারিত বিবরণ প্রদান করুন"}

অতএব, আমি আপনার কাছে বিনীত অনুরোধ করছি বিষয়টি দ্রুত তদন্ত করে প্রয়োজনীয় ব্যবস্থা গ্রহণ করার জন্য।

ধন্যবাদান্তে,
${translatedName || citizenName || "নাগরিক"}
যোগাযোগ: ${contactNumber || "N/A"}`;
        }
      } catch (genError) {
        console.error("Bengali generation error:", genError.message);
        // Fallback Bengali text with translated name
        banglaText = `আমি, ${translatedName || citizenName || "নাগরিক"}, ${translatedAddress || address || "নিজ ঠিকানা"} এর বাসিন্দা, আপনার সদয় দৃষ্টি আকর্ষণ করে জানাচ্ছি যে "${keyword}" সংক্রান্ত একটি জরুরি বিষয়ে আপনার হস্তক্ষেপ কামনা করছি।

${description || "বিস্তারিত বিবরণ প্রদান করুন"}

অতএব, আমি আপনার কাছে বিনীত অনুরোধ করছি বিষয়টি দ্রুত তদন্ত করে প্রয়োজনীয় ব্যবস্থা গ্রহণ করার জন্য।

ধন্যবাদান্তে,
${translatedName || citizenName || "নাগরিক"}
যোগাযোগ: ${contactNumber || "N/A"}`;
      }
      
      // Translate Bengali to English for storage
      try {
        const enResponse = await axios.post(
          HF_TRANSLATION_API,
          { inputs: banglaText },
          {
            headers: {
              Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
              "Content-Type": "application/json"
            },
            timeout: 30000
          }
        );
        englishText = enResponse.data?.[0]?.translation_text || banglaText;
      } catch (transError) {
        console.error("Translation to English error:", transError.message);
        englishText = banglaText;
      }
      
    } else {
      // English prompt
      const englishPrompt = `You are a formal complaint writer for the Government of Bangladesh. Write a professional, context-aware complaint letter based on the following information:

Department: ${department || "Government Department"}
Issue Keyword: ${keyword}
Description: ${description || "Please describe the issue"}
Complainant Name: ${citizenName || "Citizen"}
NID: ${citizenId || "N/A"}
Address: ${address || "N/A"}
Contact: ${contactNumber || "N/A"}

Write a detailed, context-aware formal complaint letter with:
1. Proper addressing to the department head
2. Clear subject line mentioning the specific issue
3. Introduction of the complainant with details (use name: ${citizenName})
4. Detailed, context-aware description of the problem (expand on the user's input)
5. Specific, actionable requests for resolution
6. Declaration of truth
7. Professional closing

Make it sound official, urgent where appropriate, and context-aware. Use the specific keywords and details provided. Keep it concise but comprehensive (250-400 words).`;

      try {
        const enResponse = await axios.post(
          HF_TEXT_GEN_API,
          {
            inputs: englishPrompt,
            parameters: {
              max_length: 800,
              temperature: 0.7,
              do_sample: true,
              top_p: 0.95
            }
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
              "Content-Type": "application/json"
            },
            timeout: 45000
          }
        );

        englishText = enResponse.data?.[0]?.generated_text || "";
        
        // Clean up the response
        if (englishText.includes(englishPrompt)) {
          englishText = englishText.replace(englishPrompt, "").trim();
        }
        
        // If generation failed, create a fallback
        if (!englishText || englishText.length < 50) {
          englishText = `I am writing to formally complain about ${keyword}. ${description}

I, ${citizenName || "Citizen"}, residing at ${address || "N/A"}, bearing NID No. ${citizenId || "N/A"}, would like to bring the following matter to your urgent attention.

Details of the issue: ${description || "Please provide details"}

This issue has been causing significant hardship. I request you to investigate the matter urgently and take appropriate action.

Thank you for your understanding.

Yours faithfully,
${citizenName || "Citizen"}
Contact: ${contactNumber || "N/A"}`;
        }
      } catch (genError) {
        console.error("English generation error:", genError.message);
        // Fallback English text
        englishText = `I am writing to formally complain about ${keyword}. ${description}

I, ${citizenName || "Citizen"}, residing at ${address || "N/A"}, bearing NID No. ${citizenId || "N/A"}, request your urgent attention to this matter.

Please investigate and take necessary action at the earliest convenience.

Yours faithfully,
${citizenName || "Citizen"}
Contact: ${contactNumber || "N/A"}`;
      }
      
      // Translate English to Bengali
      try {
        const bnResponse = await axios.post(
          HF_TRANSLATION_API,
          { inputs: englishText },
          {
            headers: {
              Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
              "Content-Type": "application/json"
            },
            timeout: 30000
          }
        );
        banglaText = bnResponse.data?.[0]?.translation_text || englishText;
      } catch (transError) {
        console.error("Translation to Bengali error:", transError.message);
        banglaText = englishText;
      }
    }

    res.json({
      success: true,
      english: englishText,
      bangla: banglaText,
      translatedName: language === "bn" ? translatedName : citizenName,
      translatedAddress: language === "bn" ? translatedAddress : address
    });

  } catch (err) {
    console.error("AI generation error:", err.message);
    res.status(500).json({ 
      success: false, 
      message: "AI generation failed. Please try again later.",
      error: err.message 
    });
  }
});

// ============================
// Translate API
// ============================
router.post("/translate", async (req, res) => {
  const { text, targetLang } = req.body;

  if (!text) {
    return res.status(400).json({ success: false, message: "Missing text to translate" });
  }

  if (targetLang !== "bn") {
    return res.json({ success: true, translated: text });
  }

  try {
    const response = await axios.post(
      HF_TRANSLATION_API,
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
          "Content-Type": "application/json"
        },
        timeout: 30000
      }
    );

    const translated = response.data?.[0]?.translation_text || text;
    res.json({ success: true, translated });
  } catch (err) {
    console.error("Translation error:", err.message);
    res.json({ success: false, translated: text, error: err.message });
  }
});

// ============================
// Translate user data endpoint
// ============================
router.post("/translate-user-data", async (req, res) => {
  const { name, address, targetLang } = req.body;

  try {
    const [translatedName, translatedAddress] = await Promise.all([
      translateText(name, targetLang),
      translateText(address, targetLang)
    ]);

    res.json({
      success: true,
      translatedName,
      translatedAddress
    });
  } catch (error) {
    console.error("User data translation error:", error);
    res.json({ 
      success: false, 
      translatedName: name, 
      translatedAddress: address 
    });
  }
});

// ============================
// Health check endpoint
// ============================
router.get("/health", (req, res) => {
  res.json({ status: "AI service is running", apiKeySet: !!process.env.HF_API_TOKEN });
});

module.exports = router;