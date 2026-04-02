interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <div
      className={`bg-dark-card border border-dark-border rounded-lg ${
        hover ? "hover:border-photon-700 hover:bg-dark-hover transition-colors cursor-pointer" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
