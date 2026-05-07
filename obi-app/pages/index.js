import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState("conversation");
  const [showCTA, setShowCTA] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    startSession();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function startSession() {
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: "Start the session with your opening question.",
            },
          ],
        }),
      });
      const data = await res.json();
      setMessages([
        { role: "assistant", content: data.content },
      ]);
    } catch (e) {
      setMessages([
        {
          role: "assistant",
          content:
            "Let's start simple — what do you do, and who do you do it for? Don't give me the polished version. Just tell me.",
        },
      ]);
    }
    setLoading(false);
  }

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      const reply = data.content;

      const updatedMessages = [...newMessages, { role: "assistant", content: reply }];
      setMessages(updatedMessages);

      if (reply.includes("I've heard enough") || reply.includes("Your One Big Idea")) {
        setPhase("reflection");
      }

      if (reply.toLowerCase().includes("creators who convert") && phase === "reflection") {
        setShowCTA(true);
      }
    } catch (e) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ]);
    }

    setLoading(false);
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  function restart() {
    setMessages([]);
    setInput("");
    setPhase("conversation");
    setShowCTA(false);
    startSession();
  }

  function formatMessage(text) {
    return text
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n\n/g, "</p><p>")
      .replace(/\n/g, "<br />");
  }

  return (
    <>
      <Head>
        <title>OBI — One Big Idea</title>
        <meta name="description" content="Find the single idea your business grows from." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerInner}>
            <div>
              <h1 className={styles.title}>OBI — One Big Idea™</h1>
              <p className={styles.subtitle}>
                A conversation to find the single idea your business grows from.
              </p>
            </div>
            <div className={styles.phaseTag}>
              {phase === "conversation" ? "Conversation" : "Reflection"}
            </div>
          </div>
        </div>

        <div className={styles.main}>
          <div className={styles.messages}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`${styles.message} ${
                  msg.role === "user" ? styles.userMessage : styles.assistantMessage
                } ${
                  msg.role === "assistant" &&
                  (msg.content.includes("Your One Big Idea") ||
                    msg.content.includes("Other ideas worth keeping"))
                    ? styles.reflectionMessage
                    : ""
                }`}
              >
                <div className={`${styles.avatar} ${msg.role === "user" ? styles.userAvatar : styles.obiAvatar}`}>
                  {msg.role === "user" ? "You" : "OBI"}
                </div>
                <div
                  className={styles.bubble}
                  dangerouslySetInnerHTML={{
                    __html: `<p>${formatMessage(msg.content)}</p>`,
                  }}
                />
              </div>
            ))}

            {loading && (
              <div className={styles.message}>
                <div className={`${styles.avatar} ${styles.obiAvatar}`}>OBI</div>
                <div className={styles.thinking}>Thinking...</div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {showCTA && (
            <div className={styles.cta}>
              <p>The next step is building your business around it.</p>
              <a
                href="https://www.notion.so/Creators-Who-Convert-HQ-Invite-31482408780b80ecba43f843ba9806dd"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ctaButton}
              >
                Join Creators Who Convert
              </a>
            </div>
          )}

          {!showCTA && (
            <div className={styles.inputArea}>
              <textarea
                ref={inputRef}
                className={styles.input}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Type your answer..."
                rows={2}
              />
              <button
                className={styles.sendButton}
                onClick={send}
                disabled={loading || !input.trim()}
              >
                Send
              </button>
            </div>
          )}

          {showCTA && (
            <button className={styles.restartButton} onClick={restart}>
              Start over
            </button>
          )}
        </div>
      </div>
    </>
  );
}
