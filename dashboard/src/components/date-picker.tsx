import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

type DatePickerProps = {
	placeholder?: string;
	date?: Date;
	setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
	valid?: boolean;
} & React.ComponentProps<typeof Button>;

export function DatePicker({
	placeholder,
	date,
	setDate,
	valid = true,
	...props
}: DatePickerProps) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={"default"}
					{...props}
					className={cn(valid ? "text-foreground" : "text-red-500", props.className)}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{date ? format(date, "PPP") : <span>{placeholder ?? "Pick a date"}</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				<Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
			</PopoverContent>
		</Popover>
	);
}
