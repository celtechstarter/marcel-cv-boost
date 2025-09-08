import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import type { Tool } from "@/data/tools";

interface ToolCardProps {
  tool: Tool;
}

export const ToolCard = ({ tool }: ToolCardProps) => {
  return (
    <Card className="card-soft hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="text-center pb-4">
        <div className="w-16 h-16 mx-auto mb-4 bg-background rounded-lg flex items-center justify-center shadow-sm">
          <img 
            src={tool.logoPath}
            alt={tool.altText}
            className="w-12 h-12 object-contain"
            loading="lazy"
            width="48"
            height="48"
          />
        </div>
        <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors">
          {tool.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-muted-foreground leading-relaxed text-sm">
          {tool.description}
        </p>
        <Button 
          asChild
          variant="outline" 
          size="sm"
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all"
        >
          <a 
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
            aria-label={`${tool.name} öffnen (neuer Tab)`}
          >
            Tool öffnen
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};