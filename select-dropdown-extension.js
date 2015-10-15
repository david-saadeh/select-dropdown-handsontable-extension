(function (Handsontable) {

    var SelectDropdownEditor = Handsontable.editors.BaseEditor.prototype.extend();

    SelectDropdownEditor.prototype.init = function(){
        this.select = document.createElement('SELECT');
        Handsontable.Dom.addClass(this.select, 'htSelectDropdownEditor');
        this.select.style.display = 'none';
        this.select.addEventListener('change', (function() {
            this.finishEditing();
        }).bind(this));
        this.instance.rootElement.appendChild(this.select);
    };

    SelectDropdownEditor.prototype.prepare = function(){
        Handsontable.editors.BaseEditor.prototype.prepare.apply(this, arguments);


        var selectOptions = this.cellProperties.selectOptions;
        var valueField = this.cellProperties.valueField;
        var textField = this.cellProperties.textField;
        var allowNull = this.cellProperties.allowNull || false;

        var options;

        if (typeof selectOptions == 'function'){
            options =  this.prepareOptions(selectOptions(this.row, this.col, this.prop));
        } else {
            options =  this.prepareOptions(selectOptions);
        }

        Handsontable.Dom.empty(this.select);

        if(allowNull) {
            var optionElement = document.createElement('OPTION');
            optionElement.value = "";
            Handsontable.Dom.fastInnerHTML(optionElement, "");
            this.select.appendChild(optionElement);
        }

        for (var i = 0; i < options.length; i++) {
            var optionElement = document.createElement('OPTION');
            optionElement.value = (options[i])[valueField];
            Handsontable.Dom.fastInnerHTML(optionElement, (options[i])[textField]);
            this.select.appendChild(optionElement);
        }
    };

    SelectDropdownEditor.prototype.prepareOptions = function(optionsToPrepare){
        var preparedOptions = [];

        if (Array.isArray(optionsToPrepare)){
            for(var i = 0, len = optionsToPrepare.length; i < len; i++){
                preparedOptions.push(optionsToPrepare[i]);
            }
        }
        else if (typeof optionsToPrepare == 'object') {
            preparedOptions = optionsToPrepare;
        }

        return preparedOptions;

    };

    SelectDropdownEditor.prototype.getValue = function () {
        return this.select.value;
    };
    SelectDropdownEditor.prototype.getValueRaw = function () {
        return this.select.value;
    };
    SelectDropdownEditor.prototype.setValue = function (value) {
        this.select.value = value;
    };

    var showDropdown = function (element) {
        var event;
        event = document.createEvent('MouseEvents');
        event.initEvent('mousedown', false, false);
        element.dispatchEvent(event);
    };

    var onBeforeKeyDown = function (event) {
        var instance = this;
        var editor = instance.getActiveEditor();

        switch (event.keyCode){
            case Handsontable.helper.keyCode.ARROW_UP:

                var previousOption = editor.select.find('option:selected').prev();

                if (previousOption.length == 1){
                    previousOption.prop('selected', true);
                }

                event.stopImmediatePropagation();
                event.preventDefault();
                break;

            case Handsontable.helper.keyCode.ARROW_DOWN:

                var nextOption = editor.select.find('option:selected').next();

                if (nextOption.length == 1){
                    nextOption.prop('selected', true);
                }

                event.stopImmediatePropagation();
                event.preventDefault();
                break;
        }
    };

    SelectDropdownEditor.prototype.beginEditing = function() {
        this.instance.view.scrollViewport(new WalkontableCellCoords(this.row, this.col));
        this.instance.view.render();

        this.state = Handsontable.EditorState.EDITING;

        var initialValue = typeof initialValue == 'string' ? initialValue : this.originalValue;

        this.setValue(Handsontable.helper.stringify(initialValue));

        this.open();
        this._opened = true;
        this.focus();

        this.instance.view.render(); //only rerender the selections (FillHandle should disappear when beginediting is triggered)
        showDropdown(this.select);

    };

    // TODO: Refactor this with the use of new getCell() after 0.12.1
    SelectDropdownEditor.prototype.checkEditorSection = function () {
        if(this.row < this.instance.getSettings().fixedRowsTop) {
            if(this.col < this.instance.getSettings().fixedColumnsLeft) {
                return 'corner';
            } else {
                return 'top';
            }
        } else {
            if(this.col < this.instance.getSettings().fixedColumnsLeft) {
                return 'left';
            }
        }
    };

    SelectDropdownEditor.prototype.open = function () {
        var width = Handsontable.Dom.outerWidth(this.TD); //important - group layout reads together for better performance
        var height = Handsontable.Dom.outerHeight(this.TD);
        var rootOffset = Handsontable.Dom.offset(this.instance.rootElement);
        var tdOffset = Handsontable.Dom.offset(this.TD);
        var editorSection = this.checkEditorSection();
        var cssTransformOffset;

        switch(editorSection) {
            case 'top':
                cssTransformOffset = Handsontable.Dom.getCssTransform(this.instance.view.wt.wtScrollbars.vertical.clone.wtTable.holder.parentNode);
                break;
            case 'left':
                cssTransformOffset = Handsontable.Dom.getCssTransform(this.instance.view.wt.wtScrollbars.horizontal.clone.wtTable.holder.parentNode);
                break;
            case 'corner':
                cssTransformOffset = Handsontable.Dom.getCssTransform(this.instance.view.wt.wtScrollbars.corner.clone.wtTable.holder.parentNode);
                break;
        }

        var selectStyle = this.select.style;

        if(cssTransformOffset && cssTransformOffset != -1) {
            selectStyle[cssTransformOffset[0]] = cssTransformOffset[1];
        } else {
            Handsontable.Dom.resetCssTransform(this.select);
        }

        selectStyle.height = height + 'px';
        selectStyle.minWidth = width + 'px';
        selectStyle.top = tdOffset.top - rootOffset.top + 'px';
        selectStyle.left = tdOffset.left - rootOffset.left + 'px';
        selectStyle.position = 'absolute';
        selectStyle.margin = '0px';
        selectStyle.display = '';

        this.instance.addHook('beforeKeyDown', onBeforeKeyDown);

    };

    SelectDropdownEditor.prototype.close = function () {
        this.select.style.display = 'none';
        this.instance.removeHook('beforeKeyDown', onBeforeKeyDown);
    };

    SelectDropdownEditor.prototype.focus = function () {
        this.select.focus();
    };

    Handsontable.editors.SelectDropdownEditor = SelectDropdownEditor;
    Handsontable.editors.registerEditor('selectDropdown', SelectDropdownEditor);

})(Handsontable);


(function (Handsontable) {

    var clonableWRAPPER = document.createElement('DIV');
    clonableWRAPPER.className = 'htAutocompleteWrapper';

    var clonableARROW = document.createElement('DIV');
    clonableARROW.className = 'htAutocompleteArrow';
    clonableARROW.appendChild(document.createTextNode(String.fromCharCode(9660))); // workaround for https://github.com/handsontable/handsontable/issues/1946
//this is faster than innerHTML. See: https://github.com/handsontable/handsontable/wiki/JavaScript-&-DOM-performance-tips

    var wrapTdContentWithWrapper = function(TD, WRAPPER){
        WRAPPER.innerHTML = TD.innerHTML;
        Handsontable.Dom.empty(TD);
        TD.appendChild(WRAPPER);
    };

    /**
     * SelectDropdownRenderer renderer
     * @param {Object} instance Handsontable instance
     * @param {Element} TD Table cell where to render
     * @param {Number} row
     * @param {Number} col
     * @param {String|Number} prop Row object property name
     * @param value Value to render (remember to escape unsafe HTML before inserting to DOM!)
     * @param {Object} cellProperties Cell properites (shared by cell renderer and editor)
     */
    var SelectDropdownRenderer = function (instance, TD, row, col, prop, value, cellProperties) {

        var WRAPPER = clonableWRAPPER.cloneNode(true); //this is faster than createElement
        var ARROW = clonableARROW.cloneNode(true); //this is faster than createElement

        Handsontable.renderers.cellDecorator.apply(this, arguments);

        var valueField = cellProperties.valueField;
        var textField = cellProperties.textField;

        var displayText = "";
        if(value != null && value.length > 0) {
            for(var i =0; i< cellProperties.selectOptions.length; i++) {
                if((cellProperties.selectOptions[i])[valueField] == value) {
                    displayText = (cellProperties.selectOptions[i])[textField];
                    break;
                }
            }
        }

        Handsontable.Dom.fastInnerText(TD, displayText);

        TD.appendChild(ARROW);
        Handsontable.Dom.addClass(TD, 'htAutocomplete');


        if (!TD.firstChild) { //http://jsperf.com/empty-node-if-needed
            //otherwise empty fields appear borderless in demo/renderers.html (IE)
            TD.appendChild(document.createTextNode(String.fromCharCode(160))); // workaround for https://github.com/handsontable/handsontable/issues/1946
            //this is faster than innerHTML. See: https://github.com/handsontable/handsontable/wiki/JavaScript-&-DOM-performance-tips
        }

        if (!instance.acArrowListener) {
            var eventManager = Handsontable.eventManager(instance);

            //not very elegant but easy and fast
            instance.acArrowListener = function (event) {
                if (Handsontable.Dom.hasClass(event.target,'htAutocompleteArrow')) {
                    instance.view.wt.getSetting('onCellDblClick', null, new WalkontableCellCoords(row, col), TD);
                }
            };

            eventManager.addEventListener(instance.rootElement,'mousedown',instance.acArrowListener);
            eventManager.addEventListener(instance.rootElement,'afterOnCellMouseDown', function() {
                console.log("Wooo haaa");
            });

            //We need to unbind the listener after the table has been destroyed
            instance.addHookOnce('afterDestroy', function () {
                eventManager.clear();
            });
        }
    };

    Handsontable.SelectDropdownRenderer = SelectDropdownRenderer;
    Handsontable.renderers.SelectDropdownRenderer = SelectDropdownRenderer;
    Handsontable.renderers.registerRenderer('selectDropdown', SelectDropdownRenderer);
})(Handsontable);


// Define the new cell type
Handsontable.SelectDropdownCell = {
    editor: Handsontable.editors.SelectDropdownEditor,
    renderer: {render: Handsontable.renderers.SelectDropdownRenderer}, //displays small gray arrow on right side of the cell
    validator: Handsontable.AutocompleteValidator
};

Handsontable.cellTypes.selectDropdown = Handsontable.SelectDropdownCell;
