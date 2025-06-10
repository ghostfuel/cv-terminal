import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react"

type Command = "help" | "whoami" | "experience" | "skills" | "education" | "contact" | "projects" | "clear" | "exit"
type CommandMap = {
  [key in Command]: {
    description: string
    output: string[] | ReactNode[]
  }
}

interface CommandHistory {
  command: string
  output: string[] | ReactNode[]
  timestamp: Date
}

export default function App() {
  const [commandHistory, setCommandHistory] = useState<CommandHistory[]>([])
  const [currentCommand, setCurrentCommand] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  const clickableCommand = (command: Command) => (
    <span
      className="clickable-command cursor-pointer text-cyan-400 hover:text-cyan-300 underline decoration-dotted"
      onClick={() => executeCommand(command)}
    >
      {command}
    </span>
  )

  const commandHelp = (command: Command, description: string) => (
    <div className="ml-4 flex">
      <div className="w-28">{clickableCommand(command)}</div>
      <div>- {description}</div>
    </div>
  )

  const cv = {
    name: "Mitchell Bellamy",
    currentTitle: "Lead Software Engineer",
    location: "Gloucestershire, UK",
    about: [
      "Software engineer with a background in building full stack products and platforms.",
      (<>Over 8 years' {clickableCommand("experience")} across engineering disciplines and tech stacks.</>),
      "Excited to be part of, and help shape, powerful teams.",
      "A passion for inclusive and effective team culture, engineering impactful tools and exploring new technologies and ideas.",
    ],
    contact: {
      email: "TODO",
      linkedin: "https://www.linkedin.com/in/mitchell-b-49b7aa24a/",
      github: "https://github.com/ghostfuel/",
      website: "TODO",
    }
  }

  const externalLink = (href: string, text?: string) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-cyan-400 hover:text-cyan-300 underline decoration-dotted"
    >
      {text || href}
    </a>
  )

  const commands: CommandMap = {
    help: {
      description: "Show available commands",
      output: [
        "Available commands:",
        commandHelp("whoami", "Display user information"),
        commandHelp("experience", "List work experience"),
        commandHelp("skills", "Display technical skills"),
        commandHelp("education", "Show educational background"),
        commandHelp("contact", "Display contact information"),
        commandHelp("projects", "List personal projects"),
        commandHelp("clear", "Clear the terminal screen"),
        commandHelp("exit", "Close CV Terminal"),
        commandHelp("help", "Show this help message"),
      ],
    },
    whoami: {
      description: "Display user information",
      output: [
        (<div>{cv.name}</div>),
        (<div>{cv.currentTitle}</div>),
        (<div>{cv.location}</div>),
        (<div className="mt-4">{cv.about.map((line, index) => <div key={index}>{line}</div>)}</div>),
        (<div className="flex items-center gap-4 flex-wrap mt-4">
          {/* <div>📧 Email:      {cv.contact.email}</div> */}
          <span>🐙 {externalLink(cv.contact.github, "GitHub")}</span>
          <span>💼 {externalLink(cv.contact.linkedin, "LinkedIn")}</span>
          {/* <div>🌐 Website:    {cv.contact.website}</div> */}
        </div>),
      ]
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
        (<>🎓 See also: {clickableCommand("education")}, {clickableCommand("skills")}, {clickableCommand("projects")}</>)
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
        (<>🚀 See my work: {clickableCommand("projects")}, {clickableCommand("experience")}</>),
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
        (<>💼 See also: {clickableCommand("experience")}, {clickableCommand("skills")}</>),
      ],
    },
    contact: {
      description: "Display contact information",
      output: [
        // TODO: `📧 Email:    ${cv.contact.email}`,
        `📍 Location: ${cv.location}`,
        " ",
        (<>🐙 {externalLink(cv.contact.github, "GitHub")}</>),
        (<>💼 {externalLink(cv.contact.linkedin, "LinkedIn")}</>),
        // TODO: `🌐 Website:  ${cv.contact.website}`,
        " ",
        "Feel free to reach out! I'm always open to interesting opportunities!",
      ],
    },
    projects: {
      description: "List personal projects",
      output: [
        (<>🔧 {externalLink("https://www.amplified.tools", "amplified.tools")}</>),
        "   Tools for automating Spotify playlists and music discovery",
        "   Tech: AWS, Serverless, TypeScript, Node.js, Bun, React, Tailwind",
      ],
    },
    clear: {
      description: "Clear the terminal screen",
      output: [],
    },
    exit: {
      description: "Close CV Terminal",
      output: ["Goodbye! Thanks for visiting my CV.", "Connection closed."],
    },
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
    const autoTypeCommands = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Add initial system message
      setCommandHistory([
        {
          command: "",
          output: ["CV Terminal v0.1.0", `${new Date().getFullYear()} ${cv.name}`],
          timestamp: new Date(),
        },
      ])

      await new Promise((resolve) => setTimeout(resolve, 500))
      await typeCommand("whoami")
      await new Promise((resolve) => setTimeout(resolve, 1000))
      await typeCommand("help")

      setIsLoading(false)
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

  const handleKeyPress = (e: KeyboardEvent) => {
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
              <div key={lineIndex} className="text-gray-300 whitespace-pre-wrap ml-4">
                {line}
              </div>
            ))}
          </div>
        ))}

        {/* Current input line */}
        {!isLoading && (
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
                autoCapitalize="none"
                spellCheck={false}
                placeholder="type a command or tap any highlighted command..."
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
