import Link from "next/link";
import { Provider } from "react-redux";

export default function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Link href="/sandbox">HI</Link>
    </main>
  );
}
