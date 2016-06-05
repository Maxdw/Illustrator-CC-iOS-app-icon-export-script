var AppIconResizeClass = function(name, sizes) {

    var Self = this;

    var ext = "png";

    this.document = app.activeDocument;

    this.folder = null;

    this.artboard = null;

    this.parseResizeDirective = function(size) {
        if (!size.size || (size.size && size.size.split('x').length != 2)) {
            return false;
        }

        var width = size.size.split('x')[0],
            height = size.size.split('x')[1],
            scale = 1;

        if (size.scale) {
            scale = parseInt(size.scale.replace('x', ''));
        }

        var directive = {
            filename: "",
            scaleFactorWidth: this.getScaleFactorWidth(width * scale),
            scaleFactorHeight: this.getScaleFactorHeight(height * scale)
        };

        if (!size.idiom) {
            size.idiom = "unknownidiom";
        }

        if (size.scale && size.scale == "1x") {
            directive.filename = name + "." + size.idiom + size.size + "." + ext;
        }
        else if(size.scale) {
            directive.filename = name + "." + size.idiom + size.size + "@" + size.scale + "." + ext;
        }
        else {
            directive.filename = "unknownscale." + ext;
        }

        return directive;
    };

    this.setUserRequestedFolder = function() {
        this.folder = Folder.selectDialog();
    };

    this.setActiveArtboard = function() {
        if(!this.document) {
            return false;
        }

        var document = this.document,
            index = document.artboards.getActiveArtboardIndex();
    
        if(index != undefined && document.artboards[index]) {
            this.artboard = document.artboards[index];
            return true;
        }
    
        return false;
    };

    this.getScaleFactorWidth = function(newWidth) {
        if (!this.artboard) {
            return 100;
        }

        var scaleFactor,
            oldWidth = ( this.artboard.artboardRect[2] - this.artboard.artboardRect[0] );
        
        return ( newWidth / oldWidth ) * 100;
    };

    this.getScaleFactorHeight = function(newHeight) {
        if (!this.artboard) {
            return 100;
        }

        var scaleFactor,
            oldHeight = ( this.artboard.artboardRect[1] - this.artboard.artboardRect[3] );
        
        return ( newHeight / oldHeight ) * 100;
    };

    this.exportFileToPNG24 = function(filepath, scaleFactorWidth, scaleFactorHeight) {  
        var options = new ExportOptionsPNG24(),
            type = ExportType.PNG24,
            file = new File(filepath);

        options.antiAliasing = true;
        options.transparency = true;
        options.saveAsHTML = false;
        options.artBoardClipping = true;
        options.horizontalScale = scaleFactorWidth;
        options.verticalScale = scaleFactorHeight;

        this.document.exportFile(file, type, options);
        return true;
    };

    this.saveAll = function() {
        if (!this.folder || !this.artboard || !this.document) {
            return false;
        }

        var results = [];

        for (var i = 0, directive, result; i < sizes.length; i++) {
            directive = this.parseResizeDirective(sizes[i]);

            if (!directive) {
                results.push(false);
                continue;
            }

            try {
                result = this.exportFileToPNG24(this.folder.fsName + "/" + directive.filename, directive.scaleFactorWidth, directive.scaleFactorHeight);
                results.push(result);
            }
            catch(e) {
                alert(e);
            }
        }

        for (var ri = 0; ri < results.length; ri++) {
            if (!results[ri]) {
                return false;
            }
        }

        return true;
    };  

};


var icon_resizer = new AppIconResizeClass("app.icon", [
    {
      "size" : "29x29",
      "idiom" : "iphone",
      "scale" : "2x"
    },
    {
      "size" : "29x29",
      "idiom" : "iphone",
      "scale" : "3x"
    },
    {
      "size" : "40x40",
      "idiom" : "iphone",
      "scale" : "2x"
    },
    {
      "size" : "40x40",
      "idiom" : "iphone",
      "scale" : "3x"
    },
    {
      "size" : "60x60",
      "idiom" : "iphone",
      "scale" : "2x"
    },
    {
      "size" : "60x60",
      "idiom" : "iphone",
      "scale" : "3x"
    },
    {
      "size" : "29x29",
      "idiom" : "ipad",
      "scale" : "1x"
    },
    {
      "size" : "29x29",
      "idiom" : "ipad",
      "scale" : "2x"
    },
    {
      "size" : "40x40",
      "idiom" : "ipad",
      "scale" : "1x"
    },
    {
      "size" : "40x40",
      "idiom" : "ipad",
      "scale" : "2x"
    },
    {
      "size" : "76x76",
      "idiom" : "ipad",
      "scale" : "1x"
    },
    {
      "size" : "76x76",
      "idiom" : "ipad",
      "scale" : "2x"
    },
    {
      "size" : "83.5x83.5",
      "idiom" : "ipad",
      "scale" : "2x"
    }
]);

icon_resizer.setUserRequestedFolder();
icon_resizer.setActiveArtboard();

if(icon_resizer.saveAll()) {
    alert("Saved app icons to: " + icon_resizer.folder.fsName);
}
else {
    alert("Saving failed or possibly partially failed...");
}