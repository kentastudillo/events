<?php

namespace App\Http\Controllers\Api\V1;

use App\Event;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class EventsController extends Controller
{
    public function index()
    {
        return Event::all();
    }
    public function store(Request $request)
    {
        $event = Event::create($request->all());
        return $event;
    }
}