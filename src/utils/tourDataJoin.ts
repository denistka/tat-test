import { PriceOffer, PricesMap } from '../types/search';
import { Hotel, HotelsMap, TourCardData } from '../types/hotel';

/**
 * Merges price offers with hotel data and sorts them by price (ascending).
 * 
 * @param prices - Map of price offers from search results.
 * @param hotels - Map of hotel details fetched for the specific country.
 * @returns An array of enriched tour card data, sorted by price.
 */
export const joinTourData = (
  prices: PricesMap,
  hotels: HotelsMap
): TourCardData[] => {
  const enrichedTours: TourCardData[] = [];

  Object.values(prices).forEach((price: PriceOffer) => {
    const hotelID = price.hotelID;
    
    // Check if hotel data exists in the map
    // Note: API returns hotel IDs as numbers in the object, but we might get them as strings from PriceOffer
    const hotel = hotelID ? hotels[hotelID] : undefined;

    if (hotel) {
      enrichedTours.push({
        priceId: price.id,
        amount: price.amount,
        currency: price.currency,
        startDate: price.startDate,
        endDate: price.endDate,
        hotel: hotel,
      });
    }
  });

  // Sort by amount ascending (lowest price first)
  return enrichedTours.sort((a, b) => a.amount - b.amount);
};
