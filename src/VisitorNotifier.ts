import { Visitor } from './Visitor.js'

/**
 * The shape of a function that is called when a visitor is seen for the first time.
 *
 * It can be a small arrow function or a method on a class of your own, whichever suits
 * the app.
 *
 * @param _visitor - The visitor that was just created.
 */
export type NewVisitorListener = (_visitor: Visitor) => void

/**
 * Keeps the list of those who want to hear about new visitors, and tells them.
 *
 * Separated from the tracker so that the tracker only has to say "this one is new" without
 * knowing how many are listening or what they do about it.
 */
export class VisitorNotifier {
  private listeners: NewVisitorListener[] = []

  /**
   * Adds someone to the list of those who are told about new visitors.
   *
   * @param listener - The function to call with the new visitor.
   */
  add(listener: NewVisitorListener): void {
    this.listeners.push(listener)
  }

  /**
   * Tells everyone on the list about a new visitor.
   *
   * A listener that fails is ignored on purpose. Notifying is something the caller added
   * on the side, and a failing webhook must not stop the visit from being tracked.
   *
   * @param visitor - The visitor that was just created.
   */
  announce(visitor: Visitor): void {
    for (const listener of this.listeners) {
      try {
        listener(visitor)
      } catch {
        // Deliberately ignored, see the note above.
      }
    }
  }
}
