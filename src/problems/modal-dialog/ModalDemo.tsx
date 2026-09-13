import { useState } from "react";
import { Modal } from "./Modal";

/**
 * The demo page. Complete — everything you need to change is in `Modal.tsx`.
 *
 * The `.modal-demo-card` wrapper below has `overflow: hidden` and a
 * `transform` on it. That is not arbitrary: a `transform` makes an element the
 * containing block for `position: fixed` descendants, so an overlay rendered
 * inline gets clipped to the card. Real layouts hit this constantly.
 *
 * "onClose called N times" is your debugger for the Escape-listener bug.
 */
export function ModalDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [closeCount, setCloseCount] = useState(0);

  const handleClose = () => {
    setCloseCount((c) => c + 1);
    setIsOpen(false);
  };

  return (
    <div className="modal-demo">
      <div className="modal-demo-card">
        <p>
          This card has <code>overflow: hidden</code> and a{" "}
          <code>transform</code>, like any real app's scroll container or
          animated panel.
        </p>

        <button onClick={() => setIsOpen(true)}>Open dialog</button>

        <Modal isOpen={isOpen} onClose={handleClose} title="Confirm action">
          <p>
            Try clicking this text. Try pressing Escape while the dialog is
            closed. Try tabbing past the Close button.
          </p>
          <input type="text" placeholder="A focusable field" />
        </Modal>
      </div>

      <p className="modal-demo-status">onClose called {closeCount} times</p>

      <label className="modal-demo-outside">
        A field outside the dialog:{" "}
        <input type="text" placeholder="focus should never land here" />
      </label>
    </div>
  );
}
