import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { Play, Pause, RotateCcw } from "lucide-react";
import { TelegramTheme, triggerHaptic } from "@/hooks/useTelegramTheme";

const DURATIONS = [
  { label: "15 min", minutes: 15 },
  { label: "30 min", minutes: 30 },
  { label: "45 min", minutes: 45 },
  { label: "60 min", minutes: 60 },
];

export default function Timer() {
  const { theme } = useOutletContext<{ theme: TelegramTheme }>();
  const [selectedMinutes, setSelectedMinutes] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalSeconds = selectedMinutes ? selectedMinutes * 60 : 0;
  const progress = totalSeconds > 0 ? (totalSeconds - timeLeft) / totalSeconds : 0;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            triggerHaptic("success");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleSelectDuration = (minutes: number) => {
    triggerHaptic("light");
    setSelectedMinutes(minutes);
    setTimeLeft(minutes * 60);
    setIsRunning(false);
  };

  const handlePlayPause = () => {
    triggerHaptic("light");
    if (timeLeft === 0 && selectedMinutes) {
      setTimeLeft(selectedMinutes * 60);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    triggerHaptic("light");
    setIsRunning(false);
    if (selectedMinutes) {
      setTimeLeft(selectedMinutes * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // SVG circle properties
  const size = 280;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col h-full pb-24 px-6 pt-8">
      {/* Header */}
      <div className="mb-8">
        <h1 
          className="text-2xl font-bold mb-2"
          style={{ color: theme.text_color }}
        >
          Pomodoro Timer
        </h1>
        <p 
          className="text-sm"
          style={{ color: theme.hint_color }}
        >
          Choose duration and focus on your task
        </p>
      </div>

      {/* Duration Selection */}
      <div className="grid grid-cols-4 gap-2 mb-8">
        {DURATIONS.map((duration) => (
          <button
            key={duration.minutes}
            onClick={() => handleSelectDuration(duration.minutes)}
            className="py-3 px-2 rounded-xl text-sm font-medium transition-all duration-200"
            style={{
              backgroundColor: selectedMinutes === duration.minutes 
                ? theme.button_color 
                : theme.secondary_bg_color,
              color: selectedMinutes === duration.minutes 
                ? theme.button_text_color 
                : theme.text_color,
              boxShadow: selectedMinutes === duration.minutes 
                ? `0 0 20px ${theme.button_color}40` 
                : "none",
            }}
          >
            {duration.label}
          </button>
        ))}
      </div>

      {/* Timer Circle */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative" style={{ width: size, height: size }}>
          {/* Background circle */}
          <svg
            width={size}
            height={size}
            className="transform -rotate-90"
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={theme.secondary_bg_color}
              strokeWidth={strokeWidth}
            />
            {/* Progress circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={theme.button_color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-linear"
              style={{
                filter: `drop-shadow(0 0 10px ${theme.button_color}60)`,
              }}
            />
          </svg>
          
          {/* Time display */}
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <span 
              className="text-5xl font-bold tracking-tight"
              style={{ color: theme.text_color }}
            >
              {formatTime(timeLeft)}
            </span>
            {selectedMinutes && (
              <span 
                className="text-sm mt-2"
                style={{ color: theme.hint_color }}
              >
                {isRunning ? "In progress" : timeLeft === 0 ? "Completed" : "Paused"}
              </span>
            )}
          </div>
        </div>

        {/* Controls */}
        {selectedMinutes && (
          <div className="flex items-center gap-4 mt-8">
            <button
              onClick={handleReset}
              className="p-4 rounded-full transition-all duration-200 active:scale-95"
              style={{ 
                backgroundColor: theme.secondary_bg_color,
                color: theme.text_color,
              }}
            >
              <RotateCcw size={24} />
            </button>
            
            <button
              onClick={handlePlayPause}
              className="p-6 rounded-full transition-all duration-200 active:scale-95"
              style={{ 
                backgroundColor: theme.button_color,
                color: theme.button_text_color,
                boxShadow: `0 0 30px ${theme.button_color}50`,
              }}
            >
              {isRunning ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
            </button>
            
            <div className="w-14" /> {/* Spacer for symmetry */}
          </div>
        )}
      </div>
    </div>
  );
}
