import { MotionDiv } from "framer-motion";

export default function Problem() {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="py-20 bg-gray-50"
    >
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="mb-8 text-3xl font-bold text-center text-gray-900">
          The Problem: Fragmented Business Operations
        </h2>
        <div className="grid gap-8 md:grid-cols-2">
          <MotionDiv
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              Disconnected Systems
            </h3>
            <p className="text-gray-600">
              Businesses waste 20+ hours weekly switching between disconnected
              tools for CRM, marketing, operations, and analytics.
            </p>
          </MotionDiv>
          <MotionDiv
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              Manual Processes
            </h3>
            <p className="text-gray-600">
              Repetitive tasks consume valuable time that could be spent on
              strategic growth and customer relationships.
            </p>
          </MotionDiv>
          <MotionDiv
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              Data Silos
            </h3>
            <p className="text-gray-600">
              Critical business insights are trapped in isolated systems,
              preventing informed decision-making.
            </p>
          </MotionDiv>
          <MotionDiv
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              Missed Opportunities
            </h3>
            <p className="text-gray-600">
              Without unified intelligence, businesses fail to capitalize on
              trends and customer behaviors in real-time.
            </p>
          </MotionDiv>
        </div>
      </div>
    </MotionDiv>
  );
}