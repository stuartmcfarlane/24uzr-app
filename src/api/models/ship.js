// Bouy model
module.exports = {
    name: String,
    type: String,
    orcRating: Number,
    speed: {
        '1': { '0': Number, '45': Number, '90': Number, '135': Number, '180': Number }, // bft 1
        '2': { '0': Number, '45': Number, '90': Number, '135': Number, '180': Number }, // bft 2
        '3': { '0': Number, '45': Number, '90': Number, '135': Number, '180': Number }, // bft 3
        '4': { '0': Number, '45': Number, '90': Number, '135': Number, '180': Number }, // bft 4
        '5': { '0': Number, '45': Number, '90': Number, '135': Number, '180': Number }, // bft 5
        '6': { '0': Number, '45': Number, '90': Number, '135': Number, '180': Number }, // bft 6
        '7': { '0': Number, '45': Number, '90': Number, '135': Number, '180': Number }  // bft 7
    }
};