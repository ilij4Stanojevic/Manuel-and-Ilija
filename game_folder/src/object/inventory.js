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

        console.log(item);

        // for(let i=0; i<this.inventoryArray.length; i++){
        //     console.log('Item n '+i+' :');
        //     console.log(this.inventoryArray[i]);
        // }

        // console.log('Inventory end');
    }
};