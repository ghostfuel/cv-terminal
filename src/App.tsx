import type React from "react"
import { useEffect, useRef, useState } from "react"
import cv from "./cv"

interface CommandHistory {
  command: string
  output: string[]
  timestamp: Date
}

export default function App() {
  const [commandHistory, setCommandHistory] = useState<CommandHistory[]>([])
  const [currentCommand, setCurrentCommand] = useState("")
  const [isBooting, setIsBooting] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  const commands = {
    help: {
      description: "Show available commands",
      output: [
        "Available commands:",
        "  whoami          - Display summary",
        "  experience      - List current and past job roles",
        "  skills          - Display technical skills",
        "  education       - Show educational background",
        "  contact         - Display contact information",
        "  projects        - List personal projects",
        "  clear           - Clear screen",
        "  exit            - Close CV Terminal",
      ],
    },
    whoami: {
      description: "Display user information",
      output: [
        cv.name,
        cv.currentTitle,
        cv.location,
        " ",
        ...cv.about,
        " ",        
        // `📧 Email:      ${cv.contact.email}`,
        `🐙 GitHub:     ${cv.contact.github}`,
        `💼 LinkedIn:   ${cv.contact.linkedin}`,
        // `🌐 Website:    ${cv.contact.website}`,
      ],
    },
    experience: {
      description: "List work experience",
      output: [
        // Immersive
        "💼 Immersive (2022 - Present)",
        "   Lead Backend Developer",
        " ",
        "💼 Immersive (2020 - 2022)",
        "   Senior Backend Developer",
        " ",
        // Civil Service
        "🏛 Civil Service (2020 - 2022)",
        "   Software Engineer",
        "   • Technical lead for backend services in a larger-scale platform",
        "   • Designed, developed and migrated a critical cybersecurity service used by thousands of UK Organisations",
        "   • Mentored junior developers and advocated for mob programming practices",
        " ",
        "🏛 Civil Service (2018 - 2020)",
        "   Full Stack Web Developer",
        "   • Developing tools in tightly controlled system environments for context-rich analysis",
        " ",
        "🏛 Civil Service (2016 - 2018)",
        "   Technical Analyst & Developer",
        "   • Began to develop full stack (MEAN) applications for analysts",
        "   • Created tools to automate data processing and reporting",
        " ",
        "🎓 See also: education, skills, projects",
      ],
    },
    skills: {
      description: "Display technical skills",
      output: [
        "💻 Programming Languages:",
        "   JavaScript ████████████████████ 95%",
        "   TypeScript ███████████████████  90%",
        "   Python     ████████████         60%",
        " ",
        "⚛️  Frameworks & Libraries:",
        "   Node.js    ███████████████████  90%",
        "   React      ███████████████      70%",
        "   Express    ████████████████     80%",
        " ",
        "☁️  Cloud & DevOps:",
        "   AWS        █████████████████    80%",
        "   Docker     ████████████         60%",
        "   Kubernetes ██████               30%",
        "   CI/CD      █████████████████    80%",
        " ",
        "🚀 See my work: projects, experience",
      ],
    },
    education: {
      description: "Show educational background",
      output: [
        "🎓 University of Lincoln, graduated 2016",
        "    First Class Bsc. (Hons) Computer Science",
        " ",
        "📜 Certifications:",
        "    AWS Certified Practitioner (2020)",
        " ",
        "💼 See related; skills, experience",
      ],
    },
    contact: {
      description: "Display contact information",
      output: [
        `📧 Email:    ${cv.contact.email}`,
        `📍 Location: ${cv.location}`,
        " ",
        `🐙 GitHub:   ${cv.contact.github}`,
        `💼 LinkedIn: ${cv.contact.linkedin}`,
        `🌐 Website:  ${cv.contact.website}`,
        " ",
        "Feel free to reach out! I'm always open to interesting",
        "opportunities and conversations about technology.",
      ],
    },
    projects: {
      description: "List personal projects",
      output: [
        "🔧 www.amplified.tools",
        "   Tools for automating Spotify playlists and music discovery",
        "   Tech: AWS, Serverless, TypeScript, Node.js, Bun, React, Tailwind",
        `   ${cv.contact.github}/amplified-tools`,
      ],
    }
  }

  // Function to make commands in text clickable
  const makeCommandsClickable = (text: string) => {
    const commandNames = Object.keys(commands)
    let result = text

    commandNames.forEach((cmd) => {
      // Create a regex that matches the command as a whole word
      const regex = new RegExp(`\\b${cmd}\\b`, "g")
      result = result.replace(
        regex,
        `<span class="clickable-command cursor-pointer text-cyan-400 hover:text-cyan-300 underline decoration-dotted" data-command="${cmd}">${cmd}</span>`,
      )
    })

    return result
  }

  // Handle clicking on commands in the output
  const handleCommandClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.classList.contains("clickable-command")) {
      const command = target.getAttribute("data-command")
      if (command) {
        executeCommand(command)
      }
    }
  }

  // Starship-style prompt component
  const StarshipPrompt = ({ showCursor = false, command = "" }: { showCursor?: boolean, command?: string }) => (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-cyan-400 font-semibold">~/cv</span>
      <span className="text-gray-300">on</span>
      <span className="text-pink-400">⎇</span>
      <span className="text-pink-400 font-medium">main</span>
      <span className="text-gray-300">with</span>
      <span className="text-blue-400">⚛</span>
      <span className="text-blue-400 font-medium">v19.1.0</span>
      <span className="text-gray-300">via</span>
      <span className="text-yellow-400">☁️</span>
      <span className="text-yellow-400">(eu-west-2)</span>
      <div className="w-full"></div>
      {command && (
        <div className="flex items-center gap-2 mt-1">
          <span className="text-green-400 text-lg">❯</span>
          <span className="text-white">{command}</span>
        </div>
      )}
      {showCursor && <span className="text-white ml-1">█</span>}
    </div>
  )

  useEffect(() => {
    // Auto-type initial commands
    const autoTypeCommands = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Add initial system message
      setCommandHistory([
        {
          command: "",
          // Show current year in the output
          output: ["CV Terminal v0.1.0", `${new Date().getFullYear()} ${cv.name}`],
          timestamp: new Date(),
        },
      ])

      await new Promise((resolve) => setTimeout(resolve, 500))

      // Auto-type 'whoami' command
      await typeCommand("whoami")
      await new Promise((resolve) => setTimeout(resolve, 1000))
      await typeCommand("help")

      setIsBooting(false)
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }

    autoTypeCommands()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const typeCommand = (cmd: string): Promise<void> => {
    return new Promise((resolve) => {
      let currentText = ""
      let charIndex = 0

      // Add the prompt line first
      setCommandHistory((prev) => [
        ...prev,
        {
          command: "",
          output: [],
          timestamp: new Date(),
        },
      ])

      const typeInterval = setInterval(
        () => {
          if (charIndex < cmd.length) {
            currentText += cmd[charIndex]
            charIndex++

            // Update the last entry with the current typing progress
            setCommandHistory((prev) => {
              const newHistory = [...prev]
              const lastIndex = newHistory.length - 1
              newHistory[lastIndex] = {
                ...newHistory[lastIndex],
                command: currentText + (charIndex < cmd.length ? "█" : ""),
              }
              return newHistory
            })
          } else {
            clearInterval(typeInterval)

            // Remove cursor and add command output
            setTimeout(() => {
              setCommandHistory((prev) => {
                const newHistory = [...prev]
                const lastIndex = newHistory.length - 1
                newHistory[lastIndex] = {
                  ...newHistory[lastIndex],
                  command: cmd,
                  output: commands[cmd as keyof typeof commands]?.output || [`Command '${cmd}' not found.`],
                }
                return newHistory
              })
              resolve()
            }, 200)
          }
        },
        80 + Math.random() * 40,
      ) // Vary typing speed slightly for realism
    })
  }

  useEffect(() => {
    // Auto-scroll to bottom
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [commandHistory])

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase()

    if (trimmedCmd === "") return

    // Add command to history
    const newEntry: CommandHistory = {
      command: cmd,
      output: [],
      timestamp: new Date(),
    }

    if (trimmedCmd === "clear") {
      setCommandHistory([])
      setCurrentCommand("")
      return
    }

    if (trimmedCmd === "exit") {
      newEntry.output = ["Goodbye! Thanks for visiting my CV.", "Connection closed."]
      setCommandHistory((prev) => [...prev, newEntry])
      setTimeout(() => {
        window.close()
      }, 2000)
      return
    }

    if (commands[trimmedCmd as keyof typeof commands]) {
      newEntry.output = commands[trimmedCmd as keyof typeof commands].output
    } else {
      newEntry.output = [`Command '${cmd}' not found.`, "Type help to see available commands."]
    }

    setCommandHistory((prev) => [...prev, newEntry])
    setCurrentCommand("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(currentCommand)
    }
  }

  return (
    <div className="h-screen bg-black text-green-400 font-mono overflow-hidden flex flex-col">
      {/* Terminal content */}
      <div
        ref={terminalRef}
        className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600"
        onClick={handleCommandClick}
      >
        {/* Command history */}
        {commandHistory.map((entry, index) => (
          <div key={index} className="mb-3">
            {entry.command && (
              <div className="mb-1">
                <StarshipPrompt command={entry.command} />
              </div>
            )}
            {entry.output.map((line, lineIndex) => (
              <div
                key={lineIndex}
                className="text-gray-300 whitespace-pre-wrap ml-6"
                dangerouslySetInnerHTML={{ __html: makeCommandsClickable(line) }}
              />
            ))}
          </div>
        ))}

        {/* Current input line */}
        {!isBooting && (
          <div className="mb-1">
            <StarshipPrompt />
            <div className="flex items-center gap-2 mt-1">
              <span className="text-green-400 text-lg">❯</span>
              <input
                ref={inputRef}
                type="text"
                value={currentCommand}
                onChange={(e) => setCurrentCommand(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-transparent text-white outline-none"
                autoFocus
                spellCheck={false}
                placeholder="Type a command or tap any highlighted command above..."
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
