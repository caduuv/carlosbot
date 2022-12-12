module.exports = {
    buscaPorNome: (item) => {
        return new Promise((resolve, reject) => {

            setTimeout(() => {
                let url = `https://terraria.fandom.com/wiki/}`;

                let result = {
                    url: url,
                    name: "Picareta de Cacto",
                    imageURL: "https://static.wikia.nocookie.net/terraria_gamepedia/images/d/d4/Cactus_Pickaxe.png/revision/latest?cb=20200516203919&format=original",
                    description: "The Cactus Pickaxe is an early-game pickaxe that has the same power (35%) as the Copper and Tin Pickaxes, which is the lowest in the game. However, it has +1 range advantage over the Copper Pickaxe (the Copper Pickaxe has a range deduction, while the Cactus Pickaxe does not). Like other low-tier pickaxes, it can mine blocks and ores weaker than Meteorite (which can be mined with a Tungsten Pickaxe or better), and seems to have an almost identical mining time to that of its copper counterpart. This pickaxe differs from all other early-game pickaxes, though, as it is made entirely from Cactus, and is crafted at a Work Bench rather than an Anvil, meaning the player can craft it before even venturing underground. It can also function as a decent weapon early in the game as it deals 5 damage, 1 higher than the Copper Pickaxe."
                }

                resolve(result);
            }, 3000)

        })
    }

}