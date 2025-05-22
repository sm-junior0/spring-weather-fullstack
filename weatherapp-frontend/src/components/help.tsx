"use client"

import { useState } from "react"
import { HelpCircle, ChevronDown, Search, Book, MessageCircle, FileText, ExternalLink } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface FAQItem {
  question: string
  answer: string
}

export default function Help() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)

  const faqs: FAQItem[] = [
    {
      question: "How do I add a new city?",
      answer:
        "Navigate to the Cities page by clicking on the 'Cities' link in the navigation bar. Then click the 'Add New City' button and fill in the city name and country in the form that appears. Click 'Add City' to save the new city.",
    },
    {
      question: "How do I add weather data?",
      answer:
        "Go to the Weather page and click the 'Add New Weather Record' button. Select a city from the dropdown, enter the temperature, humidity, wind speed, pressure, status, and date. Click 'Create' to save the weather record.",
    },
    {
      question: "How do I edit or delete a weather record?",
      answer:
        "On the Weather page, find the weather record you want to edit or delete. Click the edit (pencil) icon to modify the record or the delete (trash) icon to remove it.",
    },
    {
      question: "How do I filter weather records?",
      answer:
        "On the Weather page, use the filter section to filter records by city and date range. Select a city from the dropdown and specify a start and end date if needed. Click 'Apply Filters' to see the filtered results.",
    },
    {
      question: "How do I change my profile information?",
      answer:
        "Go to the Profile page by clicking on your username in the top-right corner and selecting 'Profile'. Update your information in the form and click 'Save Changes'.",
    },
    {
      question: "How do I change my password?",
      answer:
        "Navigate to the Settings page, scroll down to the Security section, and click 'Update Password'. Follow the prompts to change your password.",
    },
  ]

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <HelpCircle className="h-8 w-8 text-emerald-500 mr-3" />
        <h2 className="text-3xl font-bold text-gray-800">Help Center</h2>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <a
            href="#documentation"
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 flex flex-col items-center text-center"
          >
            <Book className="h-8 w-8 text-emerald-500 mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Documentation</h3>
            <p className="text-gray-600 text-sm">Read our comprehensive guides</p>
          </a>
          <a
            href="#contact"
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 flex flex-col items-center text-center"
          >
            <MessageCircle className="h-8 w-8 text-emerald-500 mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Contact Support</h3>
            <p className="text-gray-600 text-sm">Get help from our team</p>
          </a>
          <a
            href="#tutorials"
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 flex flex-col items-center text-center"
          >
            <FileText className="h-8 w-8 text-emerald-500 mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Tutorials</h3>
            <p className="text-gray-600 text-sm">Step-by-step guides</p>
          </a>
        </motion.div>

        {/* FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Frequently Asked Questions</h3>

          {filteredFAQs.length > 0 ? (
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex justify-between items-center p-4 text-left font-medium text-gray-800 hover:bg-gray-50 transition-colors focus:outline-none"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-500 transition-transform ${expandedFAQ === index ? "transform rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence>
                    {expandedFAQ === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 bg-gray-50 border-t border-gray-200">
                          <p className="text-gray-700">{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No results found for "{searchQuery}"</p>
              <p className="text-gray-500 text-sm mt-1">Try a different search term or browse the categories above</p>
            </div>
          )}
        </motion.div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          id="contact"
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Still Need Help?</h3>
          <p className="text-gray-600 mb-6">
            Our support team is available to assist you with any questions or issues you may have.
          </p>

          <div className="flex flex-col md:flex-row gap-4">
            <a
              href="mailto:support@weatherapp.com"
              className="flex-1 bg-emerald-500 text-white py-3 px-4 rounded-lg hover:bg-emerald-600 transition-colors flex items-center justify-center"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Contact Support
            </a>
            <a
              href="https://docs.weatherapp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-gray-100 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              <ExternalLink className="h-5 w-5 mr-2" />
              Visit Documentation
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
