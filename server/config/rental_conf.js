/**
 * Configuration file dedicated to "business" constants
 */
module.exports={
    prices: new Map([["A", 80], ["B", 70], ["C", 60], ["D", 50], ["E", 40]]),
    discounts: new Map([
        /**
         * Discounts for kilometers
         */
        ["low_km", 0.95],["medium_km", 1], ["high_km", 1.05],
        /**
         *discounts for age
         */
        ["under_25", 1.05], ["over_65", 1.1],
        /**
         * extras
         */
        ["extra_drivers", 1.15], ["extra_insurance", 1.20], ["frequent_customer", 0.90],
        /**
         * critical value
         */
        ["few_cars", 1.10]
    ]),
    availability_threshold : 0.10,
    min_frequent_rentals : 3
};
