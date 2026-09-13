# 🧩 Interview Problem: Modal Dialog

Build an accessible modal dialog. One of the most commonly asked React
component questions, and the accessibility follow-ups are where it gets
interesting.

## What's given

- `Modal.tsx` — the dialog. Renders, but has three bugs.
- `ModalDemo.tsx` — the demo page. Complete, don't touch it.

The demo wraps the modal in a card with `overflow: hidden` and a `transform`.
That's deliberate — it's what a real scroll container or animated panel looks
like, and it's what exposes bug 1.

## Expected behaviour

- The dialog covers the whole viewport, regardless of where it sits in the
  React tree or what CSS its ancestors have.
- Clicking the **backdrop** closes it. Clicking **inside** the dialog — the
  title, the text, the input, or dragging to select a word — does not.
- Escape closes it **only while it's open**, and fires `onClose` exactly once
  per press. The "onClose called N times" readout should never jump by 2.
- Nothing is left listening on `document` after the component unmounts.

## The three bugs

1. **Rendered inline.** The overlay is `position: fixed`, but a transformed
   ancestor becomes the containing block for fixed descendants — so it's
   clipped to the card instead of covering the screen.
2. **Backdrop click fires from inside.** The handler is on the overlay, and
   clicks on the content bubble up to it.
3. **The keydown listener is never removed.** It's registered on mount with
   `[]` deps and has no cleanup, so it stays live while the dialog is closed —
   and StrictMode leaves you with two copies of it.

## Run it

```bash
npm run dev        # http://localhost:5173/problems/modal-dialog
npm run lint
npm run build
```

## Bonus — the accessibility follow-ups

These are what separates "I've built a modal" from "I've built a modal":

- **Focus the dialog on open**, and **restore focus to the trigger button** on
  close. Right now focus stays wherever it was.
- **Trap Tab inside the dialog.** Try tabbing past the Close button — you'll
  land on the field outside it, which a screen reader user can't escape from.
- **Announce it properly**: `role="dialog"` is there, but what about
  `aria-modal` and labelling it by its title?
- **Lock body scroll** while open.
- Then look up `<dialog>` and `.showModal()` — the platform now does most of
  this for you. Knowing when *not* to hand-roll it is a good answer.

---

Want the solution? Ask and I'll drop a completed version next to the stub.
