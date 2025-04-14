window.Inventory = {
    inventoryArray: [], 
    imageArray : [],
    nameArray : [],    

    showInventory(scene){
        this.createContainer(scene);

        scene.overlay.setVisible(true);

        this.inventoryContainer = scene.inventoryContainer;

        let nItems = this.inventoryArray.length;
        
        this.inventoryContainer.setVisible(true);
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
        this.imageArray.push(imageMineral);
        this.nameArray.push(nameMineral);

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

        this.inventoryContainer.add(this.bgImage);

        switch(nItems){
            case 0:
                this.textInit = scene.add.text(20, 20, 'Empty Inventary', { 
                    fontSize: '30px', 
                    fontFamily: "font_tutorial",
                    fill: '0x000000' 
                })
                    .setScrollFactor(0)
                    .setOrigin(0,0)
                    .setDepth(200);
                break;
            default:
                this.textInit = scene.add.text(20, 20, 'Inventary:', { 
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

        let heighInventory = 1;

        for(let i=0; i<nItems; i++){
            if(this.inventoryArray[i] != -1){
                const card = this.createInventory(scene, 10, heighInventory * 64, i);

                heighInventory += 1;

                this.inventoryContainer.add(card);
            }
        }

        this.inventoryContainer.setScrollFactor(0);
        this.inventoryContainer.setDepth(200);
        this.inventoryContainer.setVisible(false);
    },

    createInventory(scene, x, y, mineral){
        const width = (768/2) - 20;
        const height = 80;

        this.bgCard = scene.add.image(0, 0, 'bg_card');
        this.bgCard.setOrigin(0,0);
        this.bgCard.setDisplaySize(width, height);

        const img = scene.add.image(24 +3, 24 +16, this.selectImage(mineral))
            .setOrigin(0.5,0.5);
        img.setDisplaySize(48, 48);

        const nameText = scene.add.text(70, height/2 -8, this.updateInventoryText(mineral), { 
            fontFamily: "font_tutorial",
            fontSize: '16px', 
            fill: '0x000000' 
        });

        const button = scene.add.image(width-50, height/2, "use_button")
            .setInteractive({ 
                useHandCursor: true
            })
            .setDisplaySize(48,60)
            .setScrollFactor(0)
            .setOrigin(0,0.5);

        // button.on('pointerdown', () => {
        //     this.buttonClicked(scene, mineral);
        // });

        // const buttonText = scene.add.text(width - 120 + (100/2), height / 2 , 'Use', {
        //     fontSize: '12px',
        //     fill: '0x000000',
        // })
        //     .setOrigin(0.5,0.5);

        const cardContainer = scene.add.container(x, y, [this.bgCard, img, nameText ,button /*, buttonText*/]);

        return cardContainer;
    },
    
    buttonClicked(scene, position){
        let nameMineral = this.nameArray[position];
        let typeMineral = this.inventoryArray[position];
        let nItems = this.nameArray.length;

        switch(typeMineral){
            case 2:
                scene.player.damage = 500;
                break;
            case 3:
                scene.player.hp = 100;
                scene.player.heartLast = 3;
                scene.player.lifeChecked = false;
                break;
        }

        for(let i=nItems-1; i>=0; i--){
            if(this.nameArray[i] == nameMineral){
                this.inventoryArray.splice(i,1);
                this.nameArray.splice(i,1);
                this.imageArray.splice(i,1);
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
        let mineral = this.nameArray[position];
        let updatedText = mineral + " x";
        let nItems = this.inventoryArray.length;
        let qty = 0;

        if(nItems > 0){
            for(let i=position; i<nItems; i++){
                if(mineral == this.nameArray[i]){
                    qty += 1;
                }
            }
        }

        updatedText += qty;

        return updatedText;
    },

    selectImage(position){
        return this.imageArray[position];
    }, 

    removeAll(){
        let nItems =this.inventoryArray.length;

        this.inventoryArray.length = 0;
        this.imageArray.length = 0;
        this.nameArray.length = 0;
    }
};