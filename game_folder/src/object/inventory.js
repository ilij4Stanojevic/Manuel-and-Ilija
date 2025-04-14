window.Inventory = {
    inventoryArray: [], 
    imageArray : [],
    nameArray : [],    

    showInventory(scene){
        this.createContainer(scene);

        scene.overlay.setVisible(true);

        this.inventoryContainer = scene.inventoryContainer;

        let nItems = this.inventoryArray.length;

        if(nItems > 0){
            this.textInit = scene.add.text(768/2, 10, 'Inventary:', { 
                fontSize: '30px', 
                fill: '#fff' 
            })
                .setScrollFactor(0)
                .setOrigin(0,0)
                .setDepth(200);  
        }else{
            this.textInit = scene.add.text(768/2, 10, 'Empty Inventary', { 
                fontSize: '30px', 
                fill: '#fff' 
            })
                .setScrollFactor(0)
                .setOrigin(0,0)
                .setDepth(200);  
        }
        
        this.inventoryContainer.setVisible(true);
    },

    removeInventory(scene){
        scene.overlay.setVisible(false);
        this.inventoryContainer.setVisible(false);
        this.textInit.setVisible(false);
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

        this.createContainer(scene);
    },

    createContainer(scene){
        this.inventoryContainer = scene.inventoryContainer;

        this.checkDuplicateItem();

        this.inventoryContainer.removeAll(true);

        let nItems = this.inventoryArray.length;

        let widthInventory = 0;

        for(let i=0; i<nItems; i++){
            if(this.inventoryArray[i] != -1){
                const card = this.createInventory(scene, 0, widthInventory * 80, i);

                widthInventory += 1;

                this.inventoryContainer.add(card);
            }
        }

        this.inventoryContainer.setScrollFactor(0);
        this.inventoryContainer.setDepth(200);
        this.inventoryContainer.setVisible(false);
    },

    createInventory(scene, x, y, mineral){
        const width = 786 - (786/2 + 10);
        const height = 64;
        const img = scene.add.image(0, 0, this.selectImage(mineral))
            .setOrigin(0,0);
        img.setDisplaySize(64, 64);
        const nameText = scene.add.text(70, height/2 -7, this.updateInventoryText(mineral), { 
            fontSize: '14px', 
            fill: '#fff' 
        });

        const button = scene.add.rectangle(width-120, height/2 -12, 100, 30, '0xffffff')  
            .setInteractive({ 
                useHandCursor: true
            })
            .setScrollFactor(0)
            .setOrigin(0,0);

        button.on('pointerdown', () => {
            this.buttonClicked(scene, mineral);
        });

        const buttonText = scene.add.text(width - 120 + (100/2), height / 2 , 'Use', {
            fontSize: '12px',
            fill: '0x000000',
        })
            .setOrigin(0.5,0.5);

        const cardContainer = scene.add.container(x, y, [img, nameText, button, buttonText]);

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

        this.textInit.setVisible(false);

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