import React, { useState } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';

const FilterBar = ({
    filters,
    setFilters,
    sort,
    setSort,
    onClear
}) => {
    const MIN_PRICE = 0;
    const MAX_PRICE = 200000;

    const [sortOpen, setSortOpen] = useState(false);

    const handleMinPriceChange = (e) => {
        let value = parseInt(e.target.value);
        const maxValue = currentMaxPrice;

        if (value >= maxValue) {
            value = maxValue - 1;
        }

        setFilters(prev => ({
            ...prev,
            minPrice: value.toString()
        }));
    };

    const handleMaxPriceChange = (e) => {
        let value = parseInt(e.target.value);
        const minValue = currentMinPrice;

        if (value <= minValue) {
            value = minValue + 1;
        }

        setFilters(prev => ({
            ...prev,
            maxPrice: value.toString()
        }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: checked ? "true" : ""
        }));
    };

    const currentMinPrice = filters.minPrice ? parseInt(filters.minPrice) : MIN_PRICE;
    const currentMaxPrice = filters.maxPrice ? parseInt(filters.maxPrice) : MAX_PRICE;
    const hasActiveFilters = (currentMinPrice !== MIN_PRICE || currentMaxPrice !== MAX_PRICE) || filters.inStock || sort !== 'latest';

    const sortOptions = {
        'latest': 'Latest Arrivals',
        'price_asc': 'Price: Low to High',
        'price_desc': 'Price: High to Low',
        'a_z': 'Name: A - Z',
        'z_a': 'Name: Z - A'
    };

    return (
        <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 p-2 mb-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-2">

                {/* Left: Sorting */}
                <div className="relative w-full md:w-auto z-20">
                    <button
                        onClick={() => setSortOpen(!sortOpen)}
                        className="flex items-center justify-between w-full md:w-56 px-4 py-2.5 bg-gray-50 hover:bg-white border border-gray-200 hover:border-blue-200 text-gray-700 text-sm font-medium rounded-3xl transition-all shadow-sm outline-none"
                    >
                        <span className="truncate mr-2">{sortOptions[sort]}</span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Custom Dropdown */}
                    {sortOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setSortOpen(false)}
                            ></div>
                            <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-lg shadow-xl z-20 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-200">
                                {Object.entries(sortOptions).map(([value, label]) => (
                                    <button
                                        key={value}
                                        onClick={() => {
                                            setSort(value);
                                            setSortOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors flex items-center justify-between ${sort === value ? 'text-blue-600 font-medium bg-blue-50/50' : 'text-gray-700'}`}
                                    >
                                        {label}
                                        {sort === value && <Check className="w-3.5 h-3.5" />}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Center/Right: Filters */}
                <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8 w-full md:w-auto flex-1 justify-end">

                    {/* Price Slider Section */}
                    <div className="flex flex-col w-full lg:w-64 gap-2">
                        <div className="flex justify-between items-center text-xs font-medium text-gray-500 px-1">
                            <span>Price Range</span>
                            <span className="text-gray-900">₹{currentMinPrice} - ₹{currentMaxPrice}</span>
                        </div>
                        <div className="relative w-full h-5 flex items-center">
                            <div className="absolute w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="absolute h-full bg-cyan-700 rounded-full"
                                    style={{
                                        left: `${(currentMinPrice / MAX_PRICE) * 100}%`,
                                        right: `${100 - (currentMaxPrice / MAX_PRICE) * 100}%`
                                    }}
                                />
                            </div>
                            <input
                                type="range"
                                min={MIN_PRICE}
                                max={MAX_PRICE}
                                value={currentMinPrice}
                                onChange={handleMinPriceChange}
                                className="absolute w-full h-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_2px_4px_rgba(0,0,0,0.2)] [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-gray-100 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:mt-[-0px] [&::-webkit-slider-runnable-track]:bg-transparent"
                            />
                            <input
                                type="range"
                                min={MIN_PRICE}
                                max={MAX_PRICE}
                                value={currentMaxPrice}
                                onChange={handleMaxPriceChange}
                                className="absolute w-full h-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_2px_4px_rgba(0,0,0,0.2)] [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-gray-100 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:mt-[-0px] [&::-webkit-slider-runnable-track]:bg-transparent"
                            />
                        </div>
                    </div>

                    <div className="h-8 w-px bg-gray-200 hidden lg:block"></div>

                    {/* Stock & Clear Actions */}
                    <div className="flex items-center gap-4">
                        {/* Stock Toggle */}
                        <label className="flex items-center gap-3 cursor-pointer group select-none">
                            <span className={`text-sm font-medium transition-colors ${filters.inStock ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-700'}`}>In Stock</span>
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    name="inStock"
                                    checked={filters.inStock === "true"}
                                    onChange={handleCheckboxChange}
                                    className="sr-only peer"
                                />
                                <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 transition-colors"></div>
                            </div>
                        </label>

                        {/* Clear Button - Dynamic Visibility */}
                        {/* Fixed width container to prevent layout shift */}
                        <div className={`w-8 h-8 flex items-center justify-center ml-2 transition-all duration-200 ease-out ${hasActiveFilters ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}`}>
                            <button
                                onClick={onClear}
                                className="p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm border border-transparent hover:border-red-100"
                                title="Clear All Filters"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default FilterBar;