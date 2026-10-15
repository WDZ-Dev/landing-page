/* One continuous backdrop behind every page: deep green-black with a fine film grain.
   No objects of its own, so the task dots in the story stay the only particles on screen. */
export default function SpaceBackground() {
  return (
    <div className="space" aria-hidden="true">
      <div className="space-glow" />
      <div className="space-grain" />
    </div>
  )
}
