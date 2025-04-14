import React, { useState } from "react";

const faqs = [
  {
    question: "Can I create multiple accounts with the same mobile number?",
    answer: (
      <>
        No, you cannot create multiple accounts using the same mobile number. 
        Each account must be linked to a unique mobile number for verification purposes.
      </>
    ),
  },
  {
    question: "How can I learn to use this platform?",
    answer: (
      <>
        You can learn to use the platform by exploring the tutorial and help sections provided within the app. 
        Additionally, there are user guides available that can walk you through the key features and operations.
      </>
    ),
  },
  {
    question: "Is Krishi_Wala available offline?",
    answer: (
      <>
        Currently, Krishi_Wala is an online platform. However, offline functionalities may be introduced in future updates.
      </>
    ),
  },
  {
    question: "If I rent a machine and it turns out to be faulty during operations, who will be responsible for it?",
    answer: (
      <>
        If a rented machine turns out to be faulty during operation, the responsibility generally falls on the rental service provider.
        You should report the issue immediately to get assistance or a replacement. It's always recommended to check the machine's condition before use.
      </>
    ),
  },
];

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFaq = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="w-full ml-0 bg-gradient-to-br from-green-300 via-blue-100 to-green-200 flex items-center justify-center  ">

      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-black text-center">FAQs</h1>
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white shadow-md text-black rounded-2xl mb-4 overflow-hidden transition-all duration-300"
          >
            <div
              onClick={() => toggleFaq(index)}
              className="cursor-pointer flex justify-between items-center p-5 text-lg font-semibold relative"
            >
              <span>{faq.question}</span>
              <span className="text-2xl transition-transform duration-200">
                {activeIndex === index ? "×" : "+"}
              </span>
            </div>
            <div
              className={`transition-all duration-300 ease-in-out px-5 overflow-hidden ${
                activeIndex === index ? "max-h-[1000px] py-4" : "max-h-0"
              }`}
            >
              <div className="text-gray-700 text-base leading-relaxed">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
