"use client"
import {AirportDto} from "@/dtos/airportdto";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {
    ArrowUpDown,
    Check,
    Clock,
    Compass,
    Flag,
    Globe,
    Loader2,
    MapPin,
    Mountain,
    Plane,
} from "lucide-react";
import {Input} from "@/components/ui/input";
import {motion} from "framer-motion";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Badge} from "@/components/ui/badge";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Label} from "@/components/ui/label";
import {Searchandfilter} from "@/app/searchandfilter";
import toast, { Toaster } from "react-hot-toast";

const getUrl = ({
                    pageSize = 10,
                    pageNumber = 0,
                    sortField,
                    sortDirection,
                    search,
                }: {
    pageSize?: number;
    pageNumber?: number;
    sortField?: string | null;
    sortDirection?: string | null;
    search?: string | null;
}) => {
    const baseUrl =
        "https://aero-hub.cfapps.us10-001.hana.ondemand.com/api/v1/airports";
    const params = new URLSearchParams({
        pageSize: pageSize.toString(),
        pageNumber: pageNumber.toString(),
    });

    if (sortField) {
        params.append("sortField", sortField);
    }
    if (sortDirection) {
        params.append("sortDirection", sortDirection);
    }
    if (search && search.trim() !== "") {
        params.append("search", search.trim());
    }
    return `${baseUrl}?${params.toString()}`;
};

const parseAirport = (raw: AirportDto): AirportDto => {
    return new AirportDto({
        icao: raw.icao,
        iata: raw.iata ?? "",
        name: raw.name,
        city: raw.city ?? "",
        state: raw.state ?? "",
        country: raw.country,
        elevation: raw.elevation,
        lat: raw.lat,
        lon: raw.lon,
        timezone: raw.timezone,
    });
};

// Replace the AirportDetailsPage function with this updated version
export default function AirportDetailsPage() {
    const [airports, setAirports] = useState<AirportDto[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [formTab, setFormTab] = useState("basic");
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
    const [newAirport, setNewAirport] = useState({
        key: "",
        icao: "",
        iata: "",
        name: "",
        city: "",
        state: "",
        country: "US", // Default country is US
        elevation: "",
        lat: "",
        lon: "",
        timezone: "",
    });
    const [formErrors, setFormErrors] = useState({});

    // Add this useEffect hook after the existing state declarations:
    useEffect(() => {
        const fetchAirports = async () => {
            setLoading(true);
            try {
                const url = getUrl({
                    pageSize: rowsPerPage,
                    pageNumber: currentPage - 1,
                    sortField: sortConfig.key,
                    sortDirection: sortConfig.direction,
                    search: searchTerm.trim(),
                });
                const resp = await fetch(url);
                const json = await resp.json();
                const rawList: AirportDto[] = json.content || [];
                setAirports(rawList.map(parseAirport));
                setTotalPages(json.totalPages);
                setTotalElements(json.totalElements);
            } catch (err) {
                console.error("Fetch error", err);
                toast.error("Error loading data");
            } finally {
                setLoading(false);
            }
        };
        fetchAirports();
    }, [
        currentPage,
        rowsPerPage,
        sortConfig.key,
        sortConfig.direction,
        searchTerm,
    ]);

    // Add this useEffect hook for updating ICAO based on key:
    useEffect(() => {
        if (newAirport.key) {
            setNewAirport((prev) => ({
                ...prev,
                icao: prev.key,
            }));
        }
    }, [newAirport.key]);

    // Add a prefetch function to load common states and timezones when the modal opens
    // Add this after the existing useEffect hooks:

    // Prefetch common states and timezones when modal opens

    // Modify the requestSort function to support a three-state cycle: unsorted -> ascending -> descending -> unsorted
    const requestSort = (key) => {
        let direction = "asc";

        if (sortConfig.key === key) {
            if (sortConfig.direction === "asc") {
                direction = "desc";
            } else if (sortConfig.direction === "desc") {
                // Reset to unsorted state
                return setSortConfig({ key: null, direction: null });
            }
        }

        setSortConfig({ key, direction });
    };

    // Update the getSortDirectionIndicator function to show appropriate indicators
    const getSortDirectionIndicator = (key) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === "asc" ? " ↑" : " ↓";
    };

    // Animation variants for table rows
    const tableRowVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.05,
                duration: 0.4,
                ease: "easeOut",
            },
        }),
        hover: {
            scale: 1.01,
            transition: { duration: 0.2 },
        },
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAirport((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error for this field if it exists
        if (formErrors[name]) {
            setFormErrors((prev) => ({
                ...prev,
                [name]: null,
            }));
        }
    };

    // Handle select changes
    const handleSelectChange = (name, value) => {
        setNewAirport((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error for this field if it exists
        if (formErrors[name]) {
            setFormErrors((prev) => ({
                ...prev,
                [name]: null,
            }));
        }
    };

    // Validate form
    const validateForm = () => {
        const errors = {};

        // Required fields
        if (!newAirport.key) errors.key = "Airport code is required";
        if (!newAirport.name) errors.name = "Airport name is required";
        if (!newAirport.city) errors.city = "City is required";

        // State validation
        if (!newAirport.state) {
            errors.state = "State is required";
        } else if (!/^[A-Za-z\s]+$/.test(newAirport.state)) {
            errors.state = "State must contain only alphabetic characters";
        }

        // Timezone validation
        if (!newAirport.timezone) {
            errors.timezone = "Timezone is required";
        } else if (!/^[A-Za-z/_]+$/.test(newAirport.timezone)) {
            errors.timezone =
                "Timezone must contain only alphabetic characters, slashes, and underscores";
        }

        // Numeric validation
        if (!newAirport.elevation) {
            errors.elevation = "Elevation is required";
        } else if (isNaN(Number(newAirport.elevation))) {
            errors.elevation = "Elevation must be a number";
        }

        if (!newAirport.lat) {
            errors.lat = "Latitude is required";
        } else if (
            isNaN(Number(newAirport.lat)) ||
            Number(newAirport.lat) < -90 ||
            Number(newAirport.lat) > 90
        ) {
            errors.lat = "Latitude must be a number between -90 and 90";
        }

        if (!newAirport.lon) {
            errors.lon = "Longitude is required";
        } else if (
            isNaN(Number(newAirport.lon)) ||
            Number(newAirport.lon) < -180 ||
            Number(newAirport.lon) > 180
        ) {
            errors.lon = "Longitude must be a number between -180 and 180";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) {
            // If there are validation errors, show the tab with errors
            if (
                Object.keys(formErrors).some((key) =>
                    ["key", "icao", "iata", "name", "city", "state"].includes(key)
                )
            ) {
                setFormTab("basic");
            } else {
                setFormTab("details");
            }
            return;
        }

        // Close the modal immediately when submitting
        setIsModalOpen(false);

        // Show loading overlay
        setIsSubmitting(true);
        setShowLoadingOverlay(true);

        // Track when the API call is complete
        let apiCallComplete = false;

        // Set a minimum display time of 3 seconds for the loading spinner
        const minDisplayTime = new Promise((resolve) => setTimeout(resolve, 3000));

        try {
            // Prepare the data for the API
            const airportData = {
                icao: newAirport.icao,
                iata: newAirport.iata,
                name: newAirport.name,
                city: newAirport.city,
                state: newAirport.state,
                country: newAirport.country, // Always US
                elevation: Number(newAirport.elevation),
                lat: Number(newAirport.lat),
                lon: Number(newAirport.lon),
                timezone: newAirport.timezone,
            };

            // Make the POST request to the API with the correct endpoint
            const response = await fetch(
                "https://aero-hub.cfapps.us10-001.hana.ondemand.com/api/v1/airports/add",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(airportData),
                }
            );

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            // After successful API response
            const result = await response.json();
            console.log("Airport added successfully:", result);

            // Show simple success toast
            toast.success("Airport added successfully");

            // Refresh the airport list to get updated data including region
            const refreshUrl = getUrl({
                pageSize: rowsPerPage,
                pageNumber: currentPage - 1,
                sortField: sortConfig.key,
                sortDirection: sortConfig.direction,
                search: searchTerm.trim(),
            });
            const refreshResp = await fetch(refreshUrl);
            const refreshData = await refreshResp.json();
            const refreshedList: AirportDto[] = refreshData.content || [];
            setAirports(refreshedList.map(parseAirport));

            setShowSuccess(true);
            apiCallComplete = true;

            // Reset form after success
            setTimeout(() => {
                setShowSuccess(false);
                setNewAirport({
                    key: "",
                    icao: "",
                    iata: "",
                    name: "",
                    city: "",
                    state: "",
                    country: "US", // Default country
                    elevation: "",
                    lat: "",
                    lon: "",
                    timezone: "",
                });
                setFormTab("basic");
            }, 1500);
        } catch (error) {
            console.error("Error adding airport:", error);
            apiCallComplete = true;

            toast.error(
                error.message ||
                "There was a problem adding the airport. Please try again."
            );
        } finally {
            await minDisplayTime;
            setIsSubmitting(false);
            setShowLoadingOverlay(false);
        }
    };

    // Add a helper component for the search results info message
    // Add this component definition before the return statement:

    const SearchResultsInfo = ({ count, loading, searchTerm }) => {
        if (loading) return null;

        if (count >= 50) {
            return (
                <div className="py-2 px-2 text-xs text-center text-muted-foreground border-t">
                    Showing first 50 results.{" "}
                    {searchTerm
                        ? `Refine your search "${searchTerm}" for more specific results.`
                        : "Type to search for more specific results."}
                </div>
            );
        }

        if (count > 0) {
            return (
                <div className="py-2 px-2 text-xs text-center text-muted-foreground border-t">
                    Found {count} {count === 1 ? "result" : "results"}
                    {searchTerm ? ` for "${searchTerm}"` : ""}.
                </div>
            );
        }

        return null;
    };

    // Replace the return statement with this updated version
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
            <div className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center justify-center mb-2">
                        <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-3 rounded-full mr-3 shadow-lg flex items-center justify-center">
                            <img
                                src="/airplane-icon.png"
                                alt="Airplane"
                                className="h-8 w-8"
                            />
                        </div>
                        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent">
                            AeroHub
                        </h1>
                    </div>
                    <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
                        Your comprehensive aviation database management system
                    </p>
                </motion.div>

                <Searchandfilter
                    searchTerm={searchTerm}
                    onSearchTermChange={setSearchTerm}
                    onAddNew={() => setIsModalOpen(true)}
                />
                {loading ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white dark:bg-slate-900 rounded-xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800"
                    >
                        <div className="p-4">
                            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-md mb-4 animate-pulse"></div>
                            {Array.from({ length: 5 }).map((_, index) => (
                                <div key={index} className="flex gap-3 mb-4">
                                    {Array.from({ length: 11 }).map((_, cellIndex) => (
                                        <div
                                            key={cellIndex}
                                            className="h-12 flex-1 bg-slate-100 dark:bg-slate-800/60 rounded-md animate-pulse"
                                            style={{
                                                animationDelay: `${(index * 11 + cellIndex) * 0.05}s`,
                                            }}
                                        ></div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white dark:bg-slate-900 rounded-xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800"
                    >
                        <div className="table-container scrollbar-hide overflow-hidden">
                            <Table>
                                <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                                    <TableRow>
                                        <TableHead
                                            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                            onClick={() => requestSort("key")}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Plane className="h-4 w-4 text-teal-500" />
                                                <span>Key{getSortDirectionIndicator("key")}</span>
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                            onClick={() => requestSort("icao")}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Globe className="h-4 w-4 text-teal-500" />
                                                <span>ICAO{getSortDirectionIndicator("icao")}</span>
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                            onClick={() => requestSort("iata")}
                                        >
                                            <div className="flex items-center gap-2">
                                                <ArrowUpDown className="h-4 w-4 text-teal-500" />
                                                <span>IATA{getSortDirectionIndicator("iata")}</span>
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                            onClick={() => requestSort("name")}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span>Name{getSortDirectionIndicator("name")}</span>
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                            onClick={() => requestSort("city")}
                                        >
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-teal-500" />
                                                <span>City{getSortDirectionIndicator("city")}</span>
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                            onClick={() => requestSort("state")}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span>State{getSortDirectionIndicator("state")}</span>
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-center"
                                            onClick={() => requestSort("country")}
                                        >
                                            <div className="flex items-center gap-2 justify-center">
                                                <Flag className="h-4 w-4 text-teal-500" />
                                                <span>
                          Country{getSortDirectionIndicator("country")}
                        </span>
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-center"
                                            onClick={() => requestSort("elevation")}
                                        >
                                            <div className="flex items-center gap-2 justify-center">
                                                <Mountain className="h-4 w-4 text-teal-500" />
                                                <span>
                          Elevation{getSortDirectionIndicator("elevation")}
                        </span>
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-right"
                                            onClick={() => requestSort("lat")}
                                        >
                                            <div className="flex items-center gap-2 justify-end">
                                                <Compass className="h-4 w-4 text-teal-500" />
                                                <span>Lat{getSortDirectionIndicator("lat")}</span>
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-right"
                                            onClick={() => requestSort("lon")}
                                        >
                                            <div className="flex items-center gap-2 justify-end">
                                                <Compass className="h-4 w-4 text-teal-500" />
                                                <span>Lon{getSortDirectionIndicator("lon")}</span>
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                            onClick={() => requestSort("timezone")}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-teal-500" />
                                                <span>
                          Timezone{getSortDirectionIndicator("timezone")}
                        </span>
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                            onClick={() => {}}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Globe className="h-4 w-4 text-teal-500" />
                                                <span>Region</span>
                                            </div>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {airports.length > 0 ? (
                                        airports.map((airport, index) => (
                                            <motion.tr
                                                key={airport.key}
                                                custom={index}
                                                initial="hidden"
                                                animate="visible"
                                                variants={tableRowVariants}
                                                whileHover={{
                                                    scale: 1.01,
                                                    y: -5,
                                                }}
                                                className={`group transition-all duration-200 hover:shadow-md cursor-pointer transform hover:scale-[1.01] ${
                                                    airport.elevation > 8000
                                                        ? "bg-blue-50 dark:bg-blue-800/20 border-l-4 border-l-blue-400"
                                                        : "hover:bg-teal-50 dark:hover:bg-teal-900/10"
                                                }`}
                                            >
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2">
                            <span className="font-mono text-teal-600 dark:text-teal-400">
                              {airport.key}
                            </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-mono">
                                                    {airport.icao}
                                                </TableCell>
                                                <TableCell className="font-mono">
                                                    {airport.iata || "-"}
                                                </TableCell>
                                                <TableCell>{airport.name}</TableCell>
                                                <TableCell>{airport.city}</TableCell>
                                                <TableCell>{airport.state}</TableCell>
                                                <TableCell className="text-center">
                                                    {airport.country}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {airport.elevation > 8000 ? (
                                                        <div className="flex items-center justify-center">
                                                            <Badge
                                                                variant="outline"
                                                                className="bg-blue-50 dark:bg-blue-800/30 text-blue-700 dark:text-blue-200 border-blue-200"
                                                            >
                                                                {airport.elevation} ft{" "}
                                                                <Mountain className="h-3 w-3 ml-1 inline" />
                                                            </Badge>
                                                        </div>
                                                    ) : (
                                                        `${airport.elevation} ft`
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {airport.lat.toFixed(4)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {airport.lon.toFixed(4)}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className="font-mono text-xs"
                                                    >
                                                        {airport.timezone}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{airport.region}</TableCell>
                                            </motion.tr>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={11} className="h-24 text-center">
                                                No airports found matching your criteria.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="flex items-center justify-between px-4 py-4 border-t border-slate-200 dark:border-slate-800">
                            <div className="flex items-center">
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                    Showing{" "}
                                    <span className="font-medium">
                    {(currentPage - 1) * rowsPerPage + 1}
                  </span>{" "}
                                    to{" "}
                                    <span className="font-medium">
                    {Math.min(currentPage * rowsPerPage, totalElements)}
                  </span>{" "}
                                    of <span className="font-medium">{totalElements}</span>{" "}
                                    airports
                                </div>
                                <div className="ml-4 flex items-center">
                                    <div className="w-3 h-3 bg-blue-50 dark:bg-blue-800/30 border border-blue-200 rounded-sm mr-1"></div>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                    High elevation (&gt;8,000 ft)
                  </span>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                                    }
                                    disabled={currentPage === 1}
                                    className="h-8 w-8 p-0 flex items-center justify-center"
                                >
                                    <span className="sr-only">Previous Page</span>
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
                                        <polyline points="15 18 9 12 15 6"></polyline>
                                    </svg>
                                </Button>

                                <div className="flex items-center">
                                    {(() => {
                                        // Improved pagination logic to show first pages, ellipsis, and last page
                                        let pages = [];

                                        if (totalPages <= 4) {
                                            // If we have 4 or fewer pages, show all of them
                                            pages = Array.from(
                                                { length: totalPages },
                                                (_, i) => i + 1
                                            );
                                        } else {
                                            // Show first 3 pages, ellipsis, and last page when not near the end
                                            if (currentPage < 3) {
                                                pages = [1, 2, 3];
                                            } else if (currentPage >= totalPages - 2) {
                                                // When near the end, show last 3 pages
                                                pages = [totalPages - 2, totalPages - 1, totalPages];
                                            } else {
                                                // Show current page and one on each side
                                                pages = [currentPage - 1, currentPage, currentPage + 1];
                                            }
                                        }

                                        const renderedPages = pages.map((page) => (
                                            <Button
                                                key={page}
                                                variant={currentPage === page ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setCurrentPage(page)}
                                                className={`h-8 min-w-[2.5rem] px-2 mx-1 flex items-center justify-center ${
                                                    currentPage === page
                                                        ? "bg-teal-500 hover:bg-teal-600"
                                                        : ""
                                                }`}
                                            >
                                                {page}
                                            </Button>
                                        ));

                                        // Add ellipsis and last page button if not already showing last pages
                                        if (totalPages > 4 && !pages.includes(totalPages)) {
                                            renderedPages.push(
                                                <span key="ellipsis" className="mx-1">
                          ...
                        </span>,
                                                <Button
                                                    key={totalPages}
                                                    variant={
                                                        currentPage === totalPages ? "default" : "outline"
                                                    }
                                                    size="sm"
                                                    onClick={() => setCurrentPage(totalPages)}
                                                    className={`h-8 min-w-[2.5rem] px-2 mx-1 flex items-center justify-center ${
                                                        currentPage === totalPages
                                                            ? "bg-teal-500 hover:bg-teal-600"
                                                            : ""
                                                    }`}
                                                >
                                                    {totalPages}
                                                </Button>
                                            );
                                        }

                                        // Add ellipsis and first page button if not already showing first pages
                                        if (
                                            totalPages > 4 &&
                                            currentPage > 3 &&
                                            !pages.includes(1)
                                        ) {
                                            renderedPages.unshift(
                                                <Button
                                                    key={1}
                                                    variant={currentPage === 1 ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => setCurrentPage(1)}
                                                    className={`h-8 min-w-[2.5rem] px-2 mx-1 flex items-center justify-center ${
                                                        currentPage === 1
                                                            ? "bg-teal-500 hover:bg-teal-600"
                                                            : ""
                                                    }`}
                                                >
                                                    1
                                                </Button>,
                                                <span key="ellipsis-start" className="mx-1">
                          ...
                        </span>
                                            );
                                        }

                                        return renderedPages;
                                    })()}
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                                    }
                                    disabled={currentPage === totalPages}
                                    className="h-8 w-8 p-0 flex items-center justify-center"
                                >
                                    <span className="sr-only">Next Page</span>
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
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </Button>

                                <div className="ml-4 w-32">
                                    <Select
                                        value={rowsPerPage.toString()}
                                        onValueChange={(value) => {
                                            setRowsPerPage(Number(value));
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <SelectTrigger className="h-8">
                                            <SelectValue placeholder="Rows" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="10">10 rows</SelectItem>
                                            <SelectItem value="20">20 rows</SelectItem>
                                            <SelectItem value="50">50 rows</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400"
                >
                    <p>
                        Airport data is refreshed daily. Last updated:{" "}
                        {new Date().toLocaleTimeString()}
                    </p>
                </motion.div>
            </div>

            {/* Add New Airport Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[600px] p-0">
                    <DialogHeader className="p-6 pb-2 bg-gradient-to-r from-teal-500/10 to-cyan-500/10">
                        <DialogTitle className="text-xl font-semibold flex items-center">
                            <Plane className="mr-2 h-5 w-5 text-teal-500" />
                            Add New Airport
                        </DialogTitle>
                    </DialogHeader>

                    <Tabs value={formTab} onValueChange={setFormTab} className="w-full">
                        <div className="px-6 pt-2">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                                <TabsTrigger value="details">Location Details</TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="p-6 pt-4 max-h-[70vh] overflow-y-auto">
                            <TabsContent value="basic" className="mt-0 space-y-4">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="key">Airport Code (Key)</Label>
                                            <Input
                                                id="key"
                                                name="key"
                                                value={newAirport.key}
                                                onChange={handleInputChange}
                                                placeholder="e.g., 00AK"
                                                className={formErrors.key ? "border-red-500" : ""}
                                                maxLength={4}
                                            />
                                            {formErrors.key && (
                                                <p className="text-sm text-red-500">{formErrors.key}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="icao">ICAO Code</Label>
                                            <Input
                                                id="icao"
                                                name="icao"
                                                value={newAirport.icao}
                                                onChange={handleInputChange}
                                                placeholder="e.g., 00AK"
                                                className="bg-slate-50"
                                                disabled
                                            />
                                            <p className="text-xs text-slate-500">
                                                Auto-filled from Airport Code
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="iata">IATA Code (Optional)</Label>
                                            <Input
                                                id="iata"
                                                name="iata"
                                                value={newAirport.iata}
                                                onChange={handleInputChange}
                                                placeholder="e.g., LAX"
                                                maxLength={3}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="name">Airport Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={newAirport.name}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Lowell Field"
                                            className={formErrors.name ? "border-red-500" : ""}
                                        />
                                        {formErrors.name && (
                                            <p className="text-sm text-red-500">{formErrors.name}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="city">City</Label>
                                            <Input
                                                id="city"
                                                name="city"
                                                value={newAirport.city}
                                                onChange={handleInputChange}
                                                placeholder="e.g., Anchor Point"
                                                className={formErrors.city ? "border-red-500" : ""}
                                            />
                                            {formErrors.city && (
                                                <p className="text-sm text-red-500">
                                                    {formErrors.city}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="state">State</Label>
                                            <Input
                                                id="state"
                                                name="state"
                                                value={newAirport.state}
                                                onChange={(e) => {
                                                    // Only allow alphabetic characters and spaces
                                                    const value = e.target.value.replace(
                                                        /[^A-Za-z\s]/g,
                                                        ""
                                                    );
                                                    handleInputChange({
                                                        target: {
                                                            name: "state",
                                                            value: value,
                                                        },
                                                    });
                                                }}
                                                placeholder="e.g., Alaska"
                                                className={formErrors.state ? "border-red-500" : ""}
                                            />
                                            {formErrors.state && (
                                                <p className="text-sm text-red-500">
                                                    {formErrors.state}
                                                </p>
                                            )}
                                            <p className="text-xs text-slate-500">
                                                Enter state name (alphabets only)
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="country">Country</Label>
                                        <Input
                                            id="country"
                                            name="country"
                                            value="US"
                                            disabled
                                            className="bg-slate-50"
                                        />
                                        <p className="text-xs text-slate-500">
                                            Default country is US
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button
                                        onClick={() => setFormTab("details")}
                                        className="bg-teal-500 hover:bg-teal-600"
                                    >
                                        Next
                                    </Button>
                                </div>
                            </TabsContent>

                            <TabsContent value="details" className="mt-0 space-y-4">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="elevation">Elevation (ft)</Label>
                                            <Input
                                                id="elevation"
                                                name="elevation"
                                                type="number"
                                                value={newAirport.elevation}
                                                onChange={handleInputChange}
                                                placeholder="e.g., 450"
                                                className={formErrors.elevation ? "border-red-500" : ""}
                                            />
                                            {formErrors.elevation && (
                                                <p className="text-sm text-red-500">
                                                    {formErrors.elevation}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="lat">Latitude</Label>
                                            <Input
                                                id="lat"
                                                name="lat"
                                                type="number"
                                                step="0.0001"
                                                value={newAirport.lat}
                                                onChange={handleInputChange}
                                                placeholder="e.g., 59.9492"
                                                className={formErrors.lat ? "border-red-500" : ""}
                                            />
                                            {formErrors.lat && (
                                                <p className="text-sm text-red-500">{formErrors.lat}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="lon">Longitude</Label>
                                            <Input
                                                id="lon"
                                                name="lon"
                                                type="number"
                                                step="0.0001"
                                                value={newAirport.lon}
                                                onChange={handleInputChange}
                                                placeholder="e.g., -151.696"
                                                className={formErrors.lon ? "border-red-500" : ""}
                                            />
                                            {formErrors.lon && (
                                                <p className="text-sm text-red-500">{formErrors.lon}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="timezone">Timezone</Label>
                                        <Input
                                            id="timezone"
                                            name="timezone"
                                            value={newAirport.timezone}
                                            onChange={(e) => {
                                                // Only allow alphabetic characters, slashes, and underscores
                                                const value = e.target.value.replace(
                                                    /[^A-Za-z/_]/g,
                                                    ""
                                                );
                                                handleInputChange({
                                                    target: {
                                                        name: "timezone",
                                                        value: value,
                                                    },
                                                });
                                            }}
                                            placeholder="e.g., America/New_York"
                                            className={formErrors.timezone ? "border-red-500" : ""}
                                        />
                                        {formErrors.timezone && (
                                            <p className="text-sm text-red-500">
                                                {formErrors.timezone}
                                            </p>
                                        )}
                                        <p className="text-xs text-slate-500">
                                            Enter timezone (alphabets only)
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <Button variant="outline" onClick={() => setFormTab("basic")}>
                                        Back
                                    </Button>
                                    <Button
                                        onClick={handleSubmit}
                                        className="bg-teal-500 hover:bg-teal-600"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Adding Airport...
                                            </>
                                        ) : showSuccess ? (
                                            <>
                                                <Check className="mr-2 h-4 w-4" />
                                                Airport Added!
                                            </>
                                        ) : (
                                            "Add Airport"
                                        )}
                                    </Button>
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>
                </DialogContent>
            </Dialog>

            {/* Loading Overlay */}
            {showLoadingOverlay && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="flex flex-col items-center">
                        <div className="relative mb-4">
                            <div className="h-32 w-32 rounded-full border-8 border-teal-500/20 border-t-teal-500 animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Plane className="h-12 w-12 text-teal-500" />
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 px-8 py-4 rounded-lg shadow-xl">
                            <p className="text-xl font-medium text-center">
                                Adding Airport...
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-1">
                                Please wait
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* React Hot Toast component */}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: "#1f2937", // Dark background
                        color: "#ffffff", // White text
                        padding: "12px",
                        borderRadius: "4px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                        border: "1px solid #374151",
                    },
                    success: {
                        style: {
                            background: "#065f46", // Dark teal for success
                            color: "#ffffff",
                            border: "1px solid #047857",
                        },
                    },
                    error: {
                        style: {
                            background: "#991b1b", // Dark red for errors
                            color: "#ffffff",
                            border: "1px solid #b91c1c",
                        },
                    },
                }}
            />
        </div>
    );
}
