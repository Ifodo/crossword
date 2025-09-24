(function(){
  'use strict';
  // Real estate categories and their words
  window.CrosswordData = window.CrosswordData || {};
  
  // Property Types
  window.CrosswordData.propertyTypes = [
    { answer: 'RESIDENTIAL', clue: 'Property type for living purposes' },
    { answer: 'COMMERCIAL', clue: 'Property type for business purposes' },
    { answer: 'INDUSTRIAL', clue: 'Property for manufacturing or production' },
    { answer: 'MULTIFAMILY', clue: 'Property with multiple housing units' },
    { answer: 'MIXEDUSE', clue: 'Property combining residential and commercial' },
    { answer: 'CONDO', clue: 'Individual unit in a shared building' },
    { answer: 'TOWNHOUSE', clue: 'Attached home sharing walls with others' },
    { answer: 'DUPLEX', clue: 'Two-unit residential building' }
  ];

  // Real Estate Terms
  window.CrosswordData.realEstateTerms = [
    { answer: 'APPRAISAL', clue: 'Professional property value assessment' },
    { answer: 'ESCROW', clue: 'Third-party account holding funds during transaction' },
    { answer: 'EQUITY', clue: 'Difference between property value and debt owed' },
    { answer: 'MORTGAGE', clue: 'Loan to purchase property' },
    { answer: 'TITLE', clue: 'Legal document proving ownership' },
    { answer: 'CLOSING', clue: 'Final stage of property purchase' },
    { answer: 'DEPRECIATION', clue: 'Decrease in property value over time' },
    { answer: 'AMORTIZATION', clue: 'Loan payment schedule spreading debt over time' },
    { answer: 'LIEN', clue: 'Legal claim against property' }
  ];

  // People in Real Estate
  window.CrosswordData.peopleinRealEstate = [
    { answer: 'REALTOR', clue: 'Licensed real estate professional' },
    { answer: 'BROKER', clue: 'Licensed to manage real estate transactions' },
    { answer: 'AGENT', clue: 'Professional who represents buyers or sellers' },
    { answer: 'LENDER', clue: 'Institution or person providing property loans' },
    { answer: 'APPRAISER', clue: 'Professional who determines property value' },
    { answer: 'INSPECTOR', clue: 'Examines property condition' },
    { answer: 'BUYER', clue: 'Person purchasing property' },
    { answer: 'SELLER', clue: 'Person offering property for sale' },
    { answer: 'DEVELOPER', clue: 'Creates new real estate projects' }
  ];

  // Real Estate Transactions
  window.CrosswordData.transactions = [
    { answer: 'OFFER', clue: 'Formal proposal to buy property' },
    { answer: 'COUNTEROFFER', clue: 'Response to modify initial offer' },
    { answer: 'CONTRACT', clue: 'Legal agreement between buyer and seller' },
    { answer: 'CONTINGENCY', clue: 'Condition that must be met for sale' },
    { answer: 'DEPOSIT', clue: 'Initial payment showing serious intent' },
    { answer: 'INSPECTION', clue: 'Professional examination of property' },
    { answer: 'CLOSING', clue: 'Final step in property transaction' },
    { answer: 'NEGOTIATION', clue: 'Process of reaching agreement on terms' }
  ];

  // Financing & Loans
  window.CrosswordData.financing = [
    { answer: 'MORTGAGE', clue: 'Property purchase loan' },
    { answer: 'INTEREST', clue: 'Cost of borrowing money' },
    { answer: 'DOWNPAYMENT', clue: 'Initial cash payment for property' },
    { answer: 'FHA', clue: 'Government-backed loan program' },
    { answer: 'PREAPPROVAL', clue: 'Initial lender review of borrower' },
    { answer: 'REFINANCE', clue: 'Replace existing loan with new terms' },
    { answer: 'POINTS', clue: 'Upfront fee to lower interest rate' },
    { answer: 'APR', clue: 'Annual Percentage Rate for loans' },
    { answer: 'CREDITSCORE', clue: 'Numerical rating of creditworthiness' }
  ];

  // Architecture & Design
  window.CrosswordData.architecture = [
    { answer: 'FLOORPLAN', clue: 'Layout diagram of property' },
    { answer: 'FOUNDATION', clue: 'Base structure of building' },
    { answer: 'HVAC', clue: 'Heating, ventilation, and air conditioning' },
    { answer: 'CURBAPPEAL', clue: 'Property\'s exterior attractiveness' },
    { answer: 'RENOVATION', clue: 'Property improvement or update' },
    { answer: 'STAGING', clue: 'Preparing property for showing' },
    { answer: 'FIXTURES', clue: 'Permanent property attachments' },
    { answer: 'SQUAREFEET', clue: 'Property size measurement' }
  ];

  // Home Features & Amenities
  window.CrosswordData.features = [
    { answer: 'GARAGE', clue: 'Vehicle storage space' },
    { answer: 'POOL', clue: 'Swimming facility' },
    { answer: 'BALCONY', clue: 'Elevated outdoor platform' },
    { answer: 'FIREPLACE', clue: 'Indoor heating feature' },
    { answer: 'KITCHENISLAND', clue: 'Freestanding kitchen workspace' },
    { answer: 'WALKINCLOSET', clue: 'Large storage room for clothes' },
    { answer: 'HARDWOOD', clue: 'Premium flooring material' },
    { answer: 'BASEMENT', clue: 'Below-ground level space' },
    { answer: 'SOLARPANELS', clue: 'Renewable energy installation' }
  ];

  // Set default category
  window.CrosswordData.default = window.CrosswordData.propertyTypes;
})();