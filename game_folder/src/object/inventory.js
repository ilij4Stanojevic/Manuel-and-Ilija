window.Inventory = {
    inventory: [],

    locker: [],

    lastItem: undefined,

    createNewArray(array){
        const newLocker = {
            type: [],
            name: [],
        };

        array.push(newLocker);

        return array.length - 1;
    },

    showInventory(scene, array){
        if(scene.inventoryContainer.visible){
            this.removeInventory(scene);
        }else{
            this.inventoryContainer = scene.inventoryContainer;

            this.createContainer(scene, array);

            scene.overlay.setVisible(true);
            
            this.inventoryContainer.setVisible(true);
        }
    },

    showLocker(scene, array){
        this.showInventory(scene, array);
    },

    removeInventory(scene){
        scene.overlay.setVisible(false);
        scene.inventoryContainer.setVisible(false);
    },

    checkDuplicateItem(array){
        for(let k=0;k<array.length; k++){
            for(let i=k+1; i<array.length;i++){
                if(array[k].type[0] == array[i].type[0] && (array[k].type[0] != -1 || array[i].type[0] != -1)){
                    this.removeItem(i, array);
                }
            }
        }
    },

    addItem(scene, item, imageMineral, nameMineral){
        let array = this.inventory;

        let newIndex = this.createNewArray(array);

        array[newIndex].type.push(item);
        array[newIndex].name.push(nameMineral);

        if(scene.inventoryContainer.visible){
            this.showInventory(scene, array);
        }
    },

    createContainer(scene, array){
        this.inventoryContainer = scene.inventoryContainer;

        let nItems;

        if(array != undefined){
            nItems = array.length;
            this.checkDuplicateItem(array); // locker o inventory
        }

        this.inventoryContainer.removeAll(true);

        this.bgImage = scene.add.image(0, 0, 'bg_inventory');
        this.bgImage.setOrigin(0,0);
        this.bgImage.setDisplaySize(768/2 + 30, 384);

        this.inventoryContainer.add(this.bgImage);

        let text;

        if(array == this.inventory){
            text = "|nventory";
        }else if(array == this.locker){
            text = "Locker";
        }

        switch(nItems){
            case 0:
                this.textInit = scene.add.text(20, 20, 'Empty '+text, {
                    fontSize: '30px', 
                    fontFamily: "font_tutorial",
                    fill: '0x000000' 
                })
                    .setScrollFactor(0)
                    .setOrigin(0,0)
                    .setDepth(200);
                break;
            case undefined:
                this.textInit = scene.add.text(20, 20, 'Empty '+text, {
                    fontSize: '30px', 
                    fontFamily: "font_tutorial",
                    fill: '0x000000' 
                })
                    .setScrollFactor(0)
                    .setOrigin(0,0)
                    .setDepth(200);
                break;
            default: // locker o inventory
                this.textInit = scene.add.text(20, 20, text+':', {
                    fontSize: '30px', 
                    fontFamily: "font_tutorial",
                    fill: '0x000000' 
                })
                    .setScrollFactor(0)
                    .setOrigin(0,0)
                    .setDepth(200); 
                    break;
        }

        this.inventoryContainer.add(this.textInit);

        let heightInventory = 1;

        if(nItems != undefined){
            for(let i=0; i<nItems; i++){
                if(array[i].type != -1 && array[i].type != undefined){ // locker o inventory
                    const card = this.createInventory(scene, 10, heightInventory * 64, i, array);
    
                    heightInventory += 1;
    
                    this.inventoryContainer.add(card);
                }
            }
        }

        this.inventoryContainer.setScrollFactor(0);
        this.inventoryContainer.setDepth(200);
        this.inventoryContainer.setVisible(false);
    },

    createInventory(scene, x, y, mineral, array){
        const width = (768/2) + 10;
        const height = 80;

        this.bgCard = scene.add.image(0, 0, 'bg_card');
        this.bgCard.setOrigin(0,0);
        this.bgCard.setDisplaySize(width, height);

        let heightImg = 25 / 50;
        heightImg = height * heightImg;

        let widthImg = 25 / 345;
        widthImg = width * widthImg ;

        const img = scene.add.image(widthImg, heightImg, this.selectImage(mineral, array)) // locker o inventory
            .setOrigin(0.5,0.5);
        img.setDisplaySize(56, 48);

        let heightText = 22 / 50 ;
        heightText = height * heightText;

        let widthText = 167 / 345;
        widthText = width * widthText;

        const nameText = scene.add.text(widthText, heightText, this.updateText(mineral, array), { // locker o inventory
            fontFamily: "font_tutorial",
            fontSize: '16px', 
            fill: '0x000000' 
        })
            .setOrigin(0.5,0.5);

        let heightButton = 8 / 50 ;
        heightButton = height * heightButton;

        let widthButton = 291 / 345;
        widthButton = width * widthButton;

        let nameButton;

        if(array == this.inventory){
            nameButton = "use_button";
        }else if(array == this.locker){
            nameButton = "transfer_button";
        }

        const button = scene.add.image(widthButton, heightButton, nameButton) // locker o inventory
            .setInteractive({ 
                useHandCursor: true
            })
            .setDisplaySize(64,57)
            .setScrollFactor(0)
            .setOrigin(0,0);

        button.on('pointerdown', () => {
            this.buttonClicked(scene, mineral, array); // locker o inventory
        });

        const cardContainer = scene.add.container(x, y, [this.bgCard, img, nameText ,button]);

        return cardContainer;
    },
    
    buttonClicked(scene, position, array){
        let nameMineral = array[position].name;
        let typeMineral = array[position].type[0];
        let nItems = array.length;

        switch(typeMineral){
            case 2:
                scene.player.damage += 10;
                console.log("I am here");
                scene.player.interactionBarShowed = true;
                scene.player.colorBar = "0xFF0000";
                break;
            case 3:
                scene.player.hp = 100;
                scene.player.heartLast = 3;
                scene.player.lifeChecked = false;
                break;
        }

        this.lastMineral = typeMineral;

        for(let i=nItems-1; i>=0; i--){
            if(array[i].name[0] == nameMineral){
                array.splice(i,1);
                break;
            }
        }

        this.createContainer(scene, array);

        this.showInventory(scene, array);
    },

    removeItem(position, array){
        array[position].type = -1;
    },

    updateText(position, array){
        let mineral = array[position].name;
        let updatedText = mineral + " x";
        let nItems = array.length;
        let qty = 0;

        if(nItems > 0){
            for(let i=position; i<nItems; i++){
                if(mineral == array[i].name[0]){
                    qty += 1;
                }
            }
        }

        updatedText += qty;

        return updatedText;
    },

    selectImage(position, array){
        return array[position].name;
    }, 

    removeAll(){
        let nItems = this.inventory.length;

        for(let i=0; i<nItems; i++){
            let newIndex = this.createNewArray(this.locker);
            this.locker[newIndex].name[0] = this.inventory[i].name[0];
            this.locker[newIndex].type[0] = this.inventory[i].name[0];
        }

        this.inventory.length = 0;

        console.log("Player died");
    }
};