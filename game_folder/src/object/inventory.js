window.Inventory = {
    inventoryArray: [], 

    showInventory(scene){
        scene.overlay.setVisible(true);
    },

    removeInventory(scene){
        scene.overlay.setVisible(false);
    },

    addInventory(scene, item){
        
    }
};