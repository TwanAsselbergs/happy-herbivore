import { Github } from "lucide-react";

export default function Footer() {
	return (
		<footer className="bg-white-primary border-t mt-12">
			<div className="container mx-auto px-6 py-8">
				<div className="flex flex-col items-center md:flex-row md:justify-between">
					<div className="mb-4 md:mb-0">
						<h2 className="text-lg font-semibold">Happy Herbivore Dashboard</h2>
						<p className="mt-2 text-sm text-muted-foreground">
							Empowering self-service experiences
						</p>
					</div>
					<div className="flex space-x-6">
						<a
							href="https://github.com/TwanAsselbergs/happy-herbivore"
							target="_blank"
							className="text-muted-foreground hover:text-foreground"
						>
							<Github className="h-5 w-5" />
							<span className="sr-only">GitHub</span>
						</a>
					</div>
				</div>
				<div className="mt-8 flex flex-col items-center md:flex-row md:justify-between">
					<nav className="flex flex-wrap justify-center space-x-4 md:justify-start">
						<a
							href="#"
							className="text-sm text-muted-foreground hover:text-foreground"
						>
							About
						</a>
						<a
							href="#"
							className="text-sm text-muted-foreground hover:text-foreground"
						>
							Privacy Policy
						</a>
						<a
							href="#"
							className="text-sm text-muted-foreground hover:text-foreground"
						>
							Terms of Service
						</a>
						<a
							href="#"
							className="text-sm text-muted-foreground hover:text-foreground"
						>
							Contact
						</a>
					</nav>
					<p className="mt-4 text-sm text-muted-foreground md:mt-0">
						© {new Date().getFullYear()} Twan Asselbergs and Noah Kamphuisen. All
						rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
