import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Box, FileText, List, Receipt } from "lucide-react";

export default function FeatureCards() {
  const features = [
    {
      title: "My Inventory",
      desc: "Manage and track your stock items easily.",
      color: "bg-googleGreen text-white",
      icon: <Box className="w-8 h-8" />,
      to: "/inventory",
    },
    {
      title: "Create Quotation",
      desc: "Quickly generate and download quotations for clients.",
      color: "bg-googleYellow text-black",
      icon: <FileText className="w-8 h-8" />,
      to: "/quotation",
    },
    {
      title: "Create Stocklist",
      desc: "Build, organize, and Download detailed stock lists.",
      color: "bg-googleBlue text-white",
      icon: <List className="w-8 h-8" />,
      to: "/stocklist",
    },
    {
      title: "Generate Invoice",
      desc: "Instantly create and download invoices.",
      color: "bg-white text-black border shadow",
      icon: <Receipt className="w-8 h-8" />,
      to: "/invoice",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
      {features.map((f, i) => (
        <Link key={i} to={f.to}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`${f.color} rounded-2xl p-6 shadow-md flex flex-col gap-3 cursor-pointer transition`}
          >
            <div>{f.icon}</div>
            <h2 className="text-lg font-bold">{f.title}</h2>
            <p className="text-sm opacity-80">{f.desc}</p>
          </motion.div>
        </Link>
      ))}
    </div>
  );
}
