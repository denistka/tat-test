import type { PriceOffer, PricesMap } from '../types/search'
import type { HotelsMap, TourCardData } from '../types/hotel'

export const joinTourData = (
  prices: PricesMap,
  hotels: HotelsMap
): TourCardData[] => {
  const enrichedTours: TourCardData[] = []

  Object.values(prices).forEach((price: PriceOffer) => {
    const hotelID = price.hotelID
    const hotel = hotelID ? hotels[hotelID] : undefined

    if (hotel) {
      enrichedTours.push({
        priceId: price.id,
        amount: price.amount,
        currency: price.currency,
        startDate: price.startDate,
        endDate: price.endDate,
        hotel,
      })
    }
  })

  return enrichedTours.sort((a, b) => a.amount - b.amount)
}
