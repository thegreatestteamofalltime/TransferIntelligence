export function openTransferBuddyChat() {
  window.dispatchEvent(new CustomEvent("open-transfer-buddy"))
}

export function TransferBuddyLink({ className }: { className?: string }) {
  return (
    <button
      onClick={openTransferBuddyChat}
      className={`font-semibold underline underline-offset-2 decoration-dotted transition-opacity hover:opacity-80 ${className ?? ""}`}
      style={{ color: "var(--brand)" }}
    >
      TransferBuddy
    </button>
  )
}
