window.Inventory = {
    inventoryArray: [], 

    showInventory(scene){
        scene.overlay.setVisible(true);
        
    },

    removeInventory(scene){
        scene.overlay.setVisible(false);
    },

    addInventory(scene, item){
        // console.log("Item added to inventory");

        this.inventoryArray.push(item);

        for(let i=1; i<this.inventoryArray.length; i++){
            // console.log('Item n '+i+' :');
            // console.log(this.inventoryArray[i]);
            console.log(this.inventoryArray[i].tipo);
        }

        // console.log('Inventory end');
    }
};