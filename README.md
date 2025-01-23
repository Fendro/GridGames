# [Grid Games]

[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

## Project Overview

**Grid Games** is a side project focused on providing a robust core library for building turn-based grid games. The
library is designed to be highly extensible and framework-agnostic, making it suitable for a wide variety of use cases
and game types.

The current focus of the project includes demonstrating the extensibility of the core by supporting functionality like
changing grid dimensions, adding multiple players, or integrating AI bots. While the first concrete implementation is a
proof-of-concept (POC) of Connect4, the goal is to eventually support other classic games such as Chess, Othello, and
more.

Although Vue.js is used in the development setup, the fundamental game logic and core features are independent of any
frontend framework, making it adaptable to different platforms and environments.

## Key Features

- **Extensibility**: Create and customize turn-based games with ease.
    - Modify grid dimensions (e.g., add a third dimension).
    - Support for multiple players and customizable game rules.
    - Integrate bots for single-player games or AI opponents.
- **Framework-Agnostic Core**: The core library can be used in any JavaScript/TypeScript environment, leaving UI and
  frontend choices flexible.
- **Game Examples and Use Cases**:
    - Demonstrates extensibility using Connect4.
    - Expands to support games like Chess, Othello, and other grid-based games.

---

## Technical Features

- **Fast Development** with [Vite](https://vitejs.dev/)
- **Type Safety** using [TypeScript](https://www.typescriptlang.org/)
- **Styled with Tailwind CSS** for utility-first CSS design
- **Linting and Formatting** with Prettier and ESLint (including TailwindCSS plugin)
- **Reactive Application** using Vue 3

---

## Prerequisites

Make sure you have the following installed on your system before running the project:

- [Node.js](https://nodejs.org/) (version >= 18.0.0)
- [npm](https://www.npmjs.com/) (comes with Node.js)

---

## Getting Started

Follow these steps to set up the project locally.

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/yourrepository.git
cd yourrepository
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Run the Development Server

Start the Vite development server:

```bash
npm run dev
```

The development server will be available at [http://localhost:5173](http://localhost:5173) by default.

#### 4. Build for Production

To create an optimized production build:

```bash
npm run build
```

The build output will be located in the `dist` folder.

#### 5. Preview the Build

After building the project, you can preview the result:

```bash
npm run preview
```

---

## Scripts

Here are the npm scripts available in the project:

- **`npm run dev`**: Starts the development server
- **`npm run build`**: Builds the project for production
- **`npm run preview`**: Previews the production build
- **`npm run type-check`**: Checks for type errors across source files.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

### Credits and References

This project is powered by:

- [Vue.js](https://vuejs.org/)
- [Vite.js](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)