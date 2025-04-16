window.Inventory = {
    inventoryArray: [], 
    imageInventory : [],
    nameInventory : [],

    showInventory(scene){
        if(scene.inventoryContainer.visible){
            this.removeInventory(scene);
        }else{
            this.inventoryContainer = scene.inventoryContainer;

            this.createContainer(scene);

            scene.overlay.setVisible(true);

            let nItems = this.inventoryArray.length;
            
            this.inventoryContainer.setVisible(true);
        }
    },

    removeInventory(scene){
        scene.overlay.setVisible(false);
        this.inventoryContainer.setVisible(false);
    },

    checkDuplicateItem(){
        for(let k=0;k<this.inventoryArray.length; k++){
            for(let i=k+1; i<this.inventoryArray.length;i++){
                if(this.inventoryArray[k] == this.inventoryArray[i]){
                    this.removeItem(i);
                }
            }
        }
    },

    addItem(scene, item, imageMineral, nameMineral){
        this.inventoryArray.push(item);
        this.imageInventory.push(imageMineral);
        this.nameInventory.push(nameMineral);

        if(scene.inventoryContainer.visible){
            this.showInventory(scene);
        }        
    },

    createContainer(scene){
        this.inventoryContainer = scene.inventoryContainer;

        this.checkDuplicateItem();

        this.inventoryContainer.removeAll(true);

        let nItems = this.inventoryArray.length;

        this.bgImage = scene.add.image(0, 0, 'bg_inventory');
        this.bgImage.setOrigin(0,0);
        this.bgImage.setDisplaySize(768/2 + 30, 384);

        this.inventoryContainer.add(this.bgImage);

        switch(nItems){
            case 0:
                this.textInit = scene.add.text(20, 20, 'Empty |nventory', { 
                    fontSize: '30px', 
                    fontFamily: "font_tutorial",
                    fill: '0x000000' 
                })
                    .setScrollFactor(0)
                    .setOrigin(0,0)
                    .setDepth(200);
                break;
            default:
                this.textInit = scene.add.text(20, 20, '|nventory:', { 
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

        for(let i=0; i<nItems; i++){
            if(this.inventoryArray[i] != -1){
                const card = this.createInventory(scene, 10, heightInventory * 64, i);

                heightInventory += 1;

                this.inventoryContainer.add(card);
            }
        }

        this.inventoryContainer.setScrollFactor(0);
        this.inventoryContainer.setDepth(200);
        this.inventoryContainer.setVisible(false);
    },

    createInventory(scene, x, y, mineral){
        const width = (768/2) + 10;
        const height = 80;

        this.bgCard = scene.add.image(0, 0, 'bg_card');
        this.bgCard.setOrigin(0,0);
        this.bgCard.setDisplaySize(width, height);

        let heightImg = 25 / 50;
        heightImg = height * heightImg;

        let widthImg = 25 / 345;
        widthImg = width * widthImg ;

        const img = scene.add.image(widthImg, heightImg, this.selectImage(mineral))
            .setOrigin(0.5,0.5);
        img.setDisplaySize(56, 48);

        let heightText = 22 / 50 ;
        heightText = height * heightText;

        let widthText = 167 / 345;
        widthText = width * widthText;

        const nameText = scene.add.text(widthText, heightText, this.updateInventoryText(mineral), {
            fontFamily: "font_tutorial",
            fontSize: '16px', 
            fill: '0x000000' 
        })
            .setOrigin(0.5,0.5);

        let heightButton = 8 / 50 ;
        heightButton = height * heightButton;

        let widthButton = 291 / 345;
        widthButton = width * widthButton;

        const button = scene.add.image(widthButton, heightButton, "use_button")
            .setInteractive({ 
                useHandCursor: true
            })
            .setDisplaySize(64,57)
            .setScrollFactor(0)
            .setOrigin(0,0);

        button.on('pointerdown', () => {
            this.buttonClicked(scene, mineral);
        });

        const cardContainer = scene.add.container(x, y, [this.bgCard, img, nameText ,button]);

        return cardContainer;
    },
    
    buttonClicked(scene, position){
        let nameMineral = this.nameInventory[position];
        let typeMineral = this.inventoryArray[position];
        let nItems = this.nameInventory.length;

        switch(typeMineral){
            case 2:
                scene.player.damage += 10;
                scene.player.interactionBarShowed = true;
                scene.player.colorBar = "0xFF0000";

                break;
            case 3:
                scene.player.hp = 100;
                scene.player.heartLast = 3;
                scene.player.lifeChecked = false;
                break;
        }

        for(let i=nItems-1; i>=0; i--){
            if(this.nameInventory[i] == nameMineral){
                this.inventoryArray.splice(i,1);
                this.nameInventory.splice(i,1);
                this.imageInventory.splice(i,1);
                break;
            }
        }

        this.createContainer(scene);

        this.showInventory(scene);
    },

    removeItem(position){
        this.inventoryArray[position] = -1;
    },

    updateInventoryText(position){
        let mineral = this.nameInventory[position];
        let updatedText = mineral + " x";
        let nItems = this.inventoryArray.length;
        let qty = 0;

        if(nItems > 0){
            for(let i=position; i<nItems; i++){
                if(mineral == this.nameInventory[i]){
                    qty += 1;
                }
            }
        }

        updatedText += qty;

        return updatedText;
    },

    selectImage(position){
        return this.imageInventory[position];
    }, 

    removeAll(){
        let nItems =this.inventoryArray.length;

        this.inventoryArray.length = 0;
        this.imageInventory.length = 0;
        this.nameInventory.length = 0;
    }
};