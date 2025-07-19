export function CountryName({ c1, c2 }: { c1: string; c2: string }) {
  return (
    <p className="text-center text-3xl">
      {c1 || "Select a Country"}
      {c2 && " vs " + c2}
    </p>
  );
}
