import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface SearchAndFilterProps {
    searchTerm: string;
    onSearchTermChange: (value: string) => void;
    onAddNew: () => void;
}

export class Searchandfilter extends React.Component<SearchAndFilterProps> {
    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.onSearchTermChange(e.target.value);
    };

    render() {
        const { searchTerm, onAddNew } = this.props;

        return (
            <Card className="mb-8 border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 pb-4">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xl font-semibold">
                            Airport Search&nbsp;&amp;&nbsp;Filters
                        </CardTitle>
                        <Button
                            onClick={onAddNew}
                            className="bg-teal-500 hover:bg-teal-600 text-white"
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add&nbsp;New&nbsp;Airport
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Input
                                    placeholder="Search by airport name..."
                                    value={searchTerm}
                                    onChange={this.handleChange}
                                    className="pl-10 border-slate-300 dark:border-slate-700"
                                />
                                <div className="absolute left-3 top-2.5 text-slate-400">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <circle cx="11" cy="11" r="8" />
                                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }
}

export default Searchandfilter;