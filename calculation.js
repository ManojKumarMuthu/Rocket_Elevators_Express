function validateRequest(tier, floors, app) {
    const unitPrices = {
      standard: 8000,
      premium: 12000,
      excelium: 15000,
    };
    const installPercentFees = {
      standard: 10,
      premium: 15,
      excelium: 20,
    };
    
    let elevatorsRequired;
  
    if (tier === "standard") {
      elevatorsRequired = Math.ceil(app / floors / 6) * Math.ceil(floors / 20);
    } else if (tier === "premium") {
      elevatorsRequired = Math.ceil(app / floors / 6) * Math.ceil(floors / 20);
    } else if (tier === "excelium") {
      elevatorsRequired = Math.ceil(app / floors / 6) * Math.ceil(floors / 20);
    }
    
    const elevatorCost = elevatorsRequired * unitPrices[tier];
    const installationFee = elevatorCost * installPercentFees[tier] / 100;
    const totalCost = elevatorCost + installationFee;
    const finalPrice = {
      "Required Elevators" : elevatorsRequired,
      "Elevator Cost": elevatorCost,
      "Installation Fees": installationFee,
      "Total Cost": totalCost,
    };
  
    return finalPrice;
  }
  
  module.exports = { validateRequest };
