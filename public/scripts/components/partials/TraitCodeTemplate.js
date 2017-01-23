/**
 * Created by ESLANK on 7/22/2016.
 */
const traitCodeTemplate = `
<div class="col-lg-9 col-md-9" ng-init="tic.loadCrops()">
    <div class="row" style="padding-top:5px">
        <div class="col-lg-4 col-md-4"><h3>Generate Trait Code</h3></div>
    </div>
    <hr id="page-heading"/>
    <form role="form" name="searchForm">
        <div class="col-md-2 col-lg-2">
            <div class="form-group">
                <label>Crop
            <span>
            <i class="glyphicon glyphicon-star required-field"></i></span>
                </label>
                <br/>
                <ui-select ng-model="tic.form.crop" reset-search-input="true" theme="select2"
                           style="width: 100%"
                           required="required">
                    <ui-select-match allow-clear="true" placeholder="Crop">{{tic.form.crop}}
                    </ui-select-match>
                    <ui-select-choices repeat="crop in tic.crops | filter: $select.search" style="width: 100%">
                        <div ng-bind-html="crop | highlight: $select.search"></div>
                    </ui-select-choices>
                </ui-select>
            </div>
        </div>
        <div class="col-md-6 col-lg-6">
            <div class="form-group">
                <label>Search(Event)<span><i
                        class="glyphicon glyphicon-star  required-field"></i></span>
                </label>
                <br/>
                <ui-select multiple tagging tagging-tokens="SPACE|ENTER" tagging-label="'Add New Event'"
                           ng-model="tic.form.events"
                           reset-search-input="true" theme="select2"
                           style="width: 100%; height: 80px !important;"
                           required="required">
                    <ui-select-match allow-clear="true" placeholder="Click here to add Events">{{$item}}
                    </ui-select-match>
                    <ui-select-choices repeat="event in tic.form.events | filter: $select.search" style="width: 100%">
                        {{event}}
                    </ui-select-choices>
                </ui-select>
            </div>
        </div>
        <div class="col-md-1 col-lg-1">
            <label class="search-label"></label>
            <div class="btn-group-vertical form-group">
                <button type="submit" class="btn btn-default" ng-click="tic.search()"
                        ng-disabled="searchForm.$invalid">
                    Generate
                </button>
                <button type="submit" class="btn btn-default" ng-click="tic.clearEvents()">
                    Clear Events
                </button>
            </div>
        </div>
    </form>
    <!--<div ng-if="!tic.traitResults">
        <div class="col-lg-9">
            <div class="bs-callout bs-callout-primary">
                <h4>No Results</h4>
                Please enter an event to begin your search
            </div>
        </div>
    </div>-->
    <div class="clearfix"></div>
    <div ng-if="tic.traitResults" style="margin-left: 15px">
        <!-- Nav pill -->
        <ul class="nav nav-pills">
            <li class="active"><a href="#suggestedTraits" aria-controls="suggestedTraits" data-toggle="pill">Suggested
                Traits
                <span class="badge">{{tic.searchResult.suggestedTraits.length}}</span></a>
            </li>
            <li><a href="#existedTraits" aria-controls="existedTraits" data-toggle="pill">Existing Traits
                <span class="badge">{{tic.searchResult.existingTraits.length}}</span></a>
            </li>
            <li><a href="#errorTraits" aria-controls="errorTraits" data-toggle="pill">Errors
                <span class="badge">{{tic.searchResult.errorTraits.length}}</span></a>
            </li>
        </ul>
        <!-- Tabs -->
        <div class="tab-content">
            <div role="tabpanel" class="tab-pane" id="existedTraits">
                <div class="row" ng-if="tic.searchResult.existingTraits.length != 0">
                    <div class="col-lg-5">
                        <div class="panel panel-default results-panel"
                             ng-repeat="entry in tic.searchResult.existingTraits">
                            <div class="panel-heading results-panel-head">{{entry.eventName}}
                            </div>
                            <div class="panel-body results-panel-body">
                                <table class="table table-borderless traitInfo">
                                    <tr>
                                        <th>Crop:</th>
                                        <th>Trait Name:</th>
                                    </tr>
                                    <tr>
                                        <td>{{entry.cropName}}</td>
                                        <td>{{entry.stackAbbr}}</td>
                                    </tr>
                                    <tr>
                                        <th>Trait Code:</th>
                                        <th>Stack Description:</th>
                                    </tr>
                                    <tr>
                                        <td>{{entry.manufacturingTraitCode}}</td>
                                        <td>{{entry.stackDesc}}</td>
                                    </tr>
                                    <tr>
                                        <th>Herbicide Code:</th>
                                    </tr>
                                    <tr>
                                        <td>{{entry.herbicideCode}}</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div role="tabpanel" class="tab-pane active" id="suggestedTraits">
                <div class="row"
                     ng-if="tic.searchResult.suggestedTraits.length != 0 && tic.searchResult.suggestedTraits != null">
                    <div class="col-lg-5">
                        <div align="right">
                            <button type="Submit" class="btn btn-primary"
                                    ng-click="tic.saveTraits()" ng-disabled="tic.countCheckedTraits() == 0">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-5" style="padding-top: 5px" ng-if="tic.showWarning">
                        <div class="alert alert-danger">
                            Please fill out the mandatory fields in
                            <strong>{{tic.invalidTraits.toString()}}</strong>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-5" style="padding-top: 5px" ng-if="tic.showError">
                        <div class="alert alert-danger">
                            {{tic.errorMessage}}
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-5">
                        <div class="panel panel-default results-panel"
                             ng-repeat="entry in tic.searchResult.suggestedTraits">
                            <div class="panel-heading results-panel-head">{{entry.eventName}}
                                <i class="custom-check-box pull-right"
                                   ng-class=" entry.checked? 'fa fa-check-circle' : 'fa fa-circle-o'"
                                   ng-click="entry.checked = !entry.checked"></i>
                            </div>
                            <div class="panel-body results-panel-body">
                                    <table class="table table-borderless traitInfo">
                                        <tr>
                                            <th>Crop:</th>
                                            <th>Trait Name:<span>
            <i class="glyphicon glyphicon-star required-field"></i></span></th>
                                        </tr>
                                        <tr>
                                            <td>{{entry.cropName}}</td>
                                            <td><input type="text" placeholder="Add TraitName" style="border: none"
                                                       ng-model="entry.stackAbbr"></td>
                                        </tr>
                                        <tr>
                                            <th>Trait Code:</th>
                                            <th>Stack Description:<span>
            <i class="glyphicon glyphicon-star required-field"></i></span></th>
                                        </tr>
                                        <tr>
                                            <td>{{entry.manufacturingTraitCode}}</td>
                                            <td><input type="text" placeholder="Add Description" style="border: none"
                                                       ng-model="entry.stackDesc"></td>
                                        </tr>
                                        <tr>
                                            <th>Herbicide Code:<span>
            <i class="glyphicon glyphicon-star required-field"></i></span></th>
                                        </tr>
                                        <tr>
                                            <td style="padding-bottom: 10px">
                                                <ui-select ng-model="entry.herbicideCode" reset-search-input="true"
                                                           theme="select2"
                                                           style="width: 100%"
                                                           ng-required=true>
                                                    <ui-select-match allow-clear="true" placeholder="HerbicideCode">
                                                        {{entry.herbicideCode}}
                                                    </ui-select-match>
                                                    <ui-select-choices
                                                            repeat="herbicideCode in tic.herbicideCodes.names | filter: $select.search"
                                                            style="width: 100%">
                                                        {{herbicideCode}} ({{tic.herbicideCodes.abbreviation[$index]}})
                                                    </ui-select-choices>
                                                </ui-select>
                                            </td>
                                        </tr>
                                    </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div role="tabpanel" class="tab-pane" id="errorTraits">
                <div class="row" ng-repeat="error in tic.searchResult.errorTraits">
                    <div class="col-lg-9">
                        <div class="bs-callout bs-callout-danger">
                            <h4>{{error.eventName}}</h4>
                            <p>
                                {{error.commercialTraitError.errorDesc}}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

`;
export default traitCodeTemplate;