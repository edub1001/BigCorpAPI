const EXPANDERS_TYPES = {
    IDepartmentExpander: Symbol.for("IDepartmentExpander"),
    IManagerExpander: Symbol.for("IManagerExpander"),
    IOfficeExpander: Symbol.for("IOfficeExpander"),
    ISuperdepartmentExpander: Symbol.for("ISuperdepartmentExpander"),
    IExpander: Symbol.for("IExpander"),
    IExpanderFactory: Symbol.for("IExpanderFactory"),
    ExpanderTreeValidator: Symbol.for("ExpanderTreeValidator")
};

export { EXPANDERS_TYPES };