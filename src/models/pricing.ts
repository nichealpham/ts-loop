export default (Pricing: any) => {
    Pricing.getCurrentPricing = async () => {
        return {
            // $1.29 for 1,000 secs
            DURATION: { 
                VALUE: 1.29, 
                UNIT: 1000 
            },
            // $0.99 for 1MB            
            STORAGE: { 
                VALUE: 0.99, 
                UNIT: Math.pow(2, 20) 
            },
        }
    }
}