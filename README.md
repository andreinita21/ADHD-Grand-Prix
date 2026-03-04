# 🏎️ ADHD Grand Prix: Task Selector

> **Overcome executive dysfunction and decision paralysis by gamifying task selection through a high-stimulation F1 racing metaphor.**

ADHD Grand Prix is a beautiful, gamified task manager built specifically for neurodivergent individuals (ADHD/Autism) who struggle with "waiting mode" and initiating tasks. 

By turning your everyday chores and to-dos into high-speed Formula 1 cars circling a perpetual track, it introduces a dopamine-driven urgency and visual competition into task selection.

![App Screenshot](./public/preview.png) *(Preview of the Race Control Dashboard)*

---

## ✨ Features

*   **🚦 The Paddock (Task Management)**
    *   Create tasks ("Drivers") with custom names.
    *   Set **Importance Multipliers** (High = 🔴 Fast, Medium = 🟡 Base, Low = 🟢 Slow).
    *   Assign distinct hex-code **Liveries** (colors) to each car, with support for unlimited custom colors and a quick-select palette.
*   **🏎️ The Perpetual Track (Idle Fidget Canvas)**
    *   A highly engaging HTML5 Canvas drawing a realistic top-down racing circuit.
    *   Active tasks orbit the track instantly, drawn as detailed 2D F1 cars (front wings, sidepods, halos, blinking tail lights, and grass textures).
    *   Car speeds scale dynamically based on their importance multiplier.
*   **🏁 The Green Flag (Selection Logic)**
    *   Initiate an intense "Sprint" taking all cars to maximum speed.
    *   A weighted RNG algorithm selects a winner based on their importance multiplier.
    *   A sleek modal interrupts to present you with your new focus task.
*   **🔧 The Pit Lane (Anti-Frustration)**
    *   Not feeling the task selected? Click **Cooldown** to send the car to the Pit Lane.
    *   Cars in the Pit Lane are visually parked in the Garage below the track.
    *   They suffer a 3-race cooldown penalty, slowly depleting after subsequent races before being automatically restored to the active grid.
*   **📱 Mobile Responsive & Premium UI**
    *   A high-end, dark-mode, glassmorphic "Race Control Dashboard" aesthetic.
    *   Flawlessly responsive: Side-by-side on desktop, seamlessly stacked on mobile.

## 🛠️ Tech Stack

*   **Framework:** [Next.js (App Router)](https://nextjs.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Database:** `better-sqlite3` (Local file-based SQL, perfect for privacy and speed)
*   **Graphics:** 2D HTML5 Canvas API

## 🚀 Getting Started

First, ensure you have Node.js installed.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/adhd-grand-prix.git
    cd adhd-grand-prix
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Open the app:**
    Navigate to [http://localhost:3000](http://localhost:3000) in your browser to enter the Paddock. *Note: SQLite will automatically build a local `tasks.db` file in your project root on first load.*

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/adhd-grand-prix/issues).

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
