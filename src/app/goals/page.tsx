"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { mockGoals } from "@/data/goals";
import { Goal } from "@/types";
import { GoalCard } from "./components/GoalCard";
import { CreateGoalModal } from "./components/CreateGoalModal";
import { motion } from "framer-motion";

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(mockGoals);

  const handleAddGoal = (newGoal: Goal) => {
    setGoals((prev) => [newGoal, ...prev]);
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8 pt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">
              أهدافي المالية
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              تابع تقدم أهدافك، الفكة هتوصلك أسرع من المتوقع.
            </p>
          </div>
          <CreateGoalModal onAddGoal={handleAddGoal} />
        </div>

        {goals.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            لا توجد أهداف بعد. ابدأ بإضافة هدف جديد!
          </div>
        ) : (
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {goals.map((goal, index) => (
              <GoalCard key={goal.id} goal={goal} index={index} />
            ))}
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}
