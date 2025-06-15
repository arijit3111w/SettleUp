
"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

export function SplitSelector({
  type,
  amount,
  participants,
  paidByUserId,
  onSplitsChange,
}) {
  const { user } = useUser();
  const [splits, setSplits] = useState([]);
  const [totalPercentage, setTotalPercentage] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [lockedUserIds, setLockedUserIds] = useState(new Set());


  // Calculate splits when inputs change
  useEffect(() => {
    if (!amount || amount <= 0 || participants.length === 0) {
      return;
    }

    let newSplits = [];

    if (type === "equal") {
      // Equal splits
      const shareAmount = amount / participants.length;
      newSplits = participants.map((participant) => ({
        userId: participant.id,
        name: participant.name,
        email: participant.email,
        imageUrl: participant.imageUrl,
        amount: shareAmount,
        percentage: 100 / participants.length,
        paid: participant.id === paidByUserId,
      }));
    } else if (type === "percentage") {
      // Initialize percentage splits evenly
      const evenPercentage = 100 / participants.length;
      newSplits = participants.map((participant) => ({
        userId: participant.id,
        name: participant.name,
        email: participant.email,
        imageUrl: participant.imageUrl,
        amount: (amount * evenPercentage) / 100,
        percentage: evenPercentage,
        paid: participant.id === paidByUserId,
      }));
    } else if (type === "exact") {
      // Initialize exact splits evenly
      const evenAmount = amount / participants.length;
      newSplits = participants.map((participant) => ({
        userId: participant.id,
        name: participant.name,
        email: participant.email,
        imageUrl: participant.imageUrl,
        amount: evenAmount,
        percentage: (evenAmount / amount) * 100,
        paid: participant.id === paidByUserId,
      }));
    }

    setSplits(newSplits);

    // Calculate totals
    const newTotalAmount = newSplits.reduce(
      (sum, split) => sum + split.amount,
      0
    );
    const newTotalPercentage = newSplits.reduce(
      (sum, split) => sum + split.percentage,
      0
    );

    setTotalAmount(newTotalAmount);
    setTotalPercentage(newTotalPercentage);

    // Notify parent about the split changes
    if (onSplitsChange) {
      onSplitsChange(newSplits);
    }
  }, [type, amount, participants, paidByUserId, onSplitsChange]);


const calculateTotals = (splits) => {
  const totalAmt = splits.reduce((sum, s) => sum + s.amount, 0);
  const totalPerc = splits.reduce((sum, s) => sum + s.percentage, 0);
  return { totalAmt, totalPerc };
};





  // Update the percentage splits - no automatic adjustment of other values
  const updatePercentageSplit = (userId, newPercentage) => {
  const clamped = Math.max(0, Math.min(newPercentage, 100));
  const newLocked = new Set(lockedUserIds);
  newLocked.add(userId);

  const updatedSplits = splits.map((split) => {
    if (split.userId === userId) {
      return {
        ...split,
        percentage: clamped,
        amount: (clamped / 100) * amount,
      };
    }
    return { ...split };
  });

  // Recalculate remaining %
  const lockedSplits = updatedSplits.filter((s) => newLocked.has(s.userId));
  const unlockedSplits = updatedSplits.filter((s) => !newLocked.has(s.userId));

  const usedPercentage = lockedSplits.reduce((sum, s) => sum + s.percentage, 0);
  const remainingPercentage = Math.max(0, 100 - usedPercentage);

  const updated = updatedSplits.map((split) => {
    if (!newLocked.has(split.userId)) {
      const share = remainingPercentage / unlockedSplits.length;
      return {
        ...split,
        percentage: share,
        amount: (share / 100) * amount,
      };
    }
    return split;
  });

  const { totalAmt, totalPerc } = calculateTotals(updated);
  setSplits(updated);
  setLockedUserIds(newLocked);
  setTotalAmount(totalAmt);
  setTotalPercentage(totalPerc);
  onSplitsChange?.(updated);
};









  // Update the exact amount splits - no automatic adjustment of other values
 const updateExactSplit = (userId, newAmount) => {
  const parsed = Math.max(0, Math.min(parseFloat(newAmount) || 0, amount));
  const newLocked = new Set(lockedUserIds);
  newLocked.add(userId);

  const updatedSplits = splits.map((split) => {
    if (split.userId === userId) {
      return {
        ...split,
        amount: parsed,
        percentage: (parsed / amount) * 100,
      };
    }
    return { ...split };
  });

  // Recalculate remaining amount
  const lockedSplits = updatedSplits.filter((s) => newLocked.has(s.userId));
  const unlockedSplits = updatedSplits.filter((s) => !newLocked.has(s.userId));

  const usedAmount = lockedSplits.reduce((sum, s) => sum + s.amount, 0);
  const remainingAmount = Math.max(0, amount - usedAmount);

  const updated = updatedSplits.map((split) => {
    if (!newLocked.has(split.userId)) {
      const share = remainingAmount / unlockedSplits.length;
      return {
        ...split,
        amount: share,
        percentage: (share / amount) * 100,
      };
    }
    return split;
  });

  const { totalAmt, totalPerc } = calculateTotals(updated);
  setSplits(updated);
  setLockedUserIds(newLocked);
  setTotalAmount(totalAmt);
  setTotalPercentage(totalPerc);
  onSplitsChange?.(updated);
};


useEffect(() => {
  setLockedUserIds(new Set());
}, [type, amount, participants]);




  // Check if totals are valid
  const isPercentageValid = Math.abs(totalPercentage - 100) < 0.01;
  const isAmountValid = Math.abs(totalAmount - amount) < 0.01;

  return (
    <div className="space-y-4 mt-4">
      {splits.map((split) => (
        <div
          key={split.userId}
          className="flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-2 min-w-[120px]">
            <Avatar className="h-7 w-7">
              <AvatarImage src={split.imageUrl} />
              <AvatarFallback>{split.name?.charAt(0) || "?"}</AvatarFallback>
            </Avatar>
            <span className="text-sm">
              {split.userId === user?.id ? "You" : split.name}
            </span>
          </div>

          {type === "equal" && (
            <div className="text-right text-sm">
              ₹{split.amount.toFixed(2)} ({split.percentage.toFixed(1)}%)
            </div>
          )}

          {type === "percentage" && (
            <div className="flex items-center gap-4 flex-1">
              <Slider
                value={[split.percentage]}
                min={0}
                max={100}
                step={1}
                onValueChange={(values) =>
                  updatePercentageSplit(split.userId, values[0])
                }
                className="flex-1"
              />
              <div className="flex gap-1 items-center min-w-[100px]">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={split.percentage.toFixed(1)}
                  onChange={(e) =>
                    updatePercentageSplit(
                      split.userId,
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-16 h-8"
                />
                <span className="text-sm text-muted-foreground">%</span>
                <span className="text-sm ml-1">₹{split.amount.toFixed(2)}</span>
              </div>
            </div>
          )}

          {type === "exact" && (
            <div className="flex items-center gap-2 flex-1">
              <div className="flex-1"></div>
              <div className="flex gap-1 items-center">
                <span className="text-sm text-muted-foreground">₹</span>
                <Input
                  type="number"
                  min="0"
                  max={amount * 2} // Allow values even higher than total for flexibility
                  step="0.01"
                  value={split.amount.toFixed(2)}
                  onChange={(e) =>
                    updateExactSplit(split.userId, e.target.value)
                  }
                  className="w-24 h-8"
                />
                <span className="text-sm text-muted-foreground ml-1">
                  ({split.percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Total row */}
      <div className="flex justify-between border-t pt-3 mt-3">
        <span className="font-medium">Total</span>
        <div className="text-right">
          <span
            className={`font-medium ${!isAmountValid ? "text-amber-600" : ""}`}
          >
            ₹{totalAmount.toFixed(2)}
          </span>
          {type !== "equal" && (
            <span
              className={`text-sm ml-2 ${!isPercentageValid ? "text-amber-600" : ""}`}
            >
              ({totalPercentage.toFixed(1)}%)
            </span>
          )}
        </div>
      </div>

      {/* Validation warnings */}
      {type === "percentage" && !isPercentageValid && (
        <div className="text-sm text-amber-600 mt-2">
          The percentages should add up to 100%.
        </div>
      )}

      {type === "exact" && !isAmountValid && (
        <div className="text-sm text-amber-600 mt-2">
          The sum of all splits (₹{totalAmount.toFixed(2)}) should equal the
          total amount (₹{amount.toFixed(2)}).
        </div>
      )}
    </div>
  );
}
